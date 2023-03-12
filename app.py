from flask import Flask, g, render_template, redirect, session, flash, request
from flask_debugtoolbar import DebugToolbarExtension
from secret_keys import app_secret_key
from models import db, connect_db, User, Template, TemplateExercise, Workout, WorkoutExercise, Set
from sqlalchemy.exc import IntegrityError
from forms import SignupForm, LoginForm, TemplateForm, WorkoutForm
from datetime import date, datetime
import requests
import json
import pdb

USER_KEY = 'curr_user'
WGER = 'https://wger.de/api/v2'

app = Flask(__name__)

app.config['SECRET_KEY'] = app_secret_key
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///CapstoneOne'
app.config['SQLALECHEMY_ECHO'] = False

toolbar = DebugToolbarExtension(app)

connect_db(app)

with app.app_context():
    db.create_all()


@app.before_request
def add_user_to_g():
    if USER_KEY in session:
        g.user = User.query.get(session[USER_KEY])
    else:
        g.user = None

##############################################################################################
# Signup/login/home routes


def do_login(user):
    session[USER_KEY] = user.id


def do_logout():
    if USER_KEY in session:
        del session[USER_KEY]


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        if g.user:
            do_logout()
        try:
            user = User.signup(username=form.username.data,
                               password=form.password.data,
                               first_name=form.first_name.data,
                               last_name=form.last_name.data,
                               birthday=form.birthday.data,
                               height=form.height.data,
                               weight=form.weight.data,
                               preferred_units=form.preferred_unit.data)
            db.session.add(user)
            db.session.commit()
            do_login(user)
            return redirect('/')
        except IntegrityError as e:
            pdb.set_trace()
            flash('Username already exists', 'err')
            return render_template('/signup.html', form=form)
    return render_template('signup.html', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if g.user:
            do_logout()

        user = User.authenticate(form.username.data, form.password.data)

        if user:
            do_login(user)
            return redirect('/')

        # flash message here

    return render_template('login.html', form=form)


@app.route('/logout')
def logout():

    do_logout()

    return redirect('/login')


@app.route('/')
def home():
    if not g.user:
        return redirect('/login')
    upcoming = Workout.query.filter(Workout.user_id == g.user.id).filter(
        Workout.completed == None).order_by(Workout.scheduled).all()
    completed = Workout.query.filter(Workout.user_id == g.user.id).filter(Workout.completed != None).order_by(
        Workout.completed.desc()).limit(10).all()
    # pdb.set_trace()
    return render_template('home.html', upcoming=upcoming, completed=completed)


########################################################################################
# Routes for templates


@app.route('/templates', methods=['GET', 'POST'])
def templates():
    templates = Template.query.filter(Template.user_id == g.user.id).all()

    return render_template('/template/templates.html', templates=templates)


@app.route('/templates/<int:temp_id>', methods=['GET', 'POST'])
def edit_template(temp_id):
    form = TemplateForm()
    results = requests.get(f'{WGER}/muscle').json()
    muscle_groups = [(res['id'], res['name_en'] if res['name_en']
                      else res['name']) for res in results['results']]
    form.muscle_groups.choices = muscle_groups
    template = Template.query.get_or_404(temp_id)
    # pdb.set_trace()
    if form.validate_on_submit():
        for ex in template.exercises:
            db.session.delete(ex)
        template_name = request.form.get('name')
        exercises = request.form.getlist('exercise')

        template.name = template_name
        for ex in exercises:
            data = json.loads(ex)
            temp_ex = TemplateExercise(exercise_id=data['id'],
                                       exercise_name=data['name'])
            template.exercises.append(temp_ex)
        db.session.commit()
        return redirect('/templates')
    return render_template('/template/edit-template.html',
                           form=form,
                           template=template)


@app.route('/templates/new', methods=['GET', 'POST'])
def create_template():
    form = TemplateForm()
    results = requests.get(f'{WGER}/muscle').json()
    muscle_groups = [(res['id'], res['name_en'] if res['name_en']
                      else res['name']) for res in results['results']]
    form.muscle_groups.choices = muscle_groups
    if form.validate_on_submit():
        # get values from request.form since some inputs are generated
        # dynamically in HTML

        # Need to check that there are indeed exercises selected. Maybe even a
        # front end validation by initially disabling create button.
        template_name = request.form.get('name')
        exercises = request.form.getlist('exercise')
        template = Template(name=template_name, user_id=g.user.id)
        db.session.add(template)
        db.session.commit()
        for ex in exercises:
            data = json.loads(ex)
            ex = TemplateExercise(template_id=template.id,
                                  exercise_id=data['id'],
                                  exercise_name=data['name'],
                                  muscle_group=data['muscle'])
            db.session.add(ex)
        db.session.commit()
        return redirect('/templates')

    return render_template('/template/new-template.html', form=form)


@app.route('/templates/<int:temp_id>/delete')
def delete_template(temp_id):
    template = Template.query.get_or_404(temp_id)
    db.session.delete(template)
    db.session.commit()
    return redirect('/templates')

############################################################################
# Routes for workouts


@app.route('/workouts/new', methods=['GET', 'POST'])
def create_workout():
    form = WorkoutForm()
    exercise_form = TemplateForm()
    results = requests.get(f'{WGER}/muscle').json()
    muscle_groups = [(res['id'], res['name_en'] if res['name_en']
                      else res['name']) for res in results['results']]
    exercise_form.muscle_groups.choices = muscle_groups
    if form.validate_on_submit():
        # pdb.set_trace()
        workout = Workout(user_id=g.user.id,
                          scheduled=form.scheduled.data)
        db.session.add(workout)
        exercises = request.form.getlist('ex-info')
        for exercise in exercises:
            data = json.loads(exercise)
            if data['sets']:
                ex = WorkoutExercise(exercise_id=data['exId'],
                                     exercise_name=data['name'],
                                     muscle_group=data['muscle'])
                db.session.add(workout)
                workout.exercises.append(ex)
                for set in data['sets']:
                    s = Set(exercise_id=data['exId'],
                            target_weight=set['tw'],
                            target_reps=set['tr'],
                            target_RPE=set['trpe'],
                            resttime=set['rt'])
                    db.session.add(s)
                    ex.sets.append(s)
        db.session.commit()
        return redirect('/')

    return render_template('/workouts/new-workout.html', form=form, exercise_form=exercise_form)


@app.route('/workouts/new/templates')
def return_templates():
    return redirect('/templates')


@app.route('/workouts/new/templates/<int:temp_id>', methods=['GET', 'POST'])
def create_from_template(temp_id):
    template = Template.query.get_or_404(temp_id)
    form = WorkoutForm()
    if form.validate_on_submit():
        return redirect('/')
    return render_template('/workouts/template-workout.html', form=form, template=template)


@app.route('/workouts/<int:workout_id>', methods=['GET', 'POST'])
def start_workout():
    return render_template('start-workout.html')

from flask import Flask, g, render_template, redirect, session, flash, request
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Template, TemplateExercise, Workout, WorkoutExercise, Set
from sqlalchemy.exc import IntegrityError
from forms import SignupForm, LoginForm, TemplateForm, WorkoutForm, ProgressForm, UserInfoForm
from datetime import date, datetime
from calendar import monthrange
from urllib.parse import parse_qsl
import plotly.express as px
import requests
import json
import pdb
import os

USER_KEY = 'curr_user'
WGER = 'https://wger.de/api/v2'

app = Flask(
    __name__, static_url_path='/static')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "secret1234")
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL').replace('postgres', 'postgresql')
app.config['SQLALECHEMY_ECHO'] = True

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

    if g.user:
        return redirect('/')

    if form.validate_on_submit():
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
            flash('Username already exists', 'err')
            return render_template('/signup.html', form=form)
    return render_template('signup.html', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if g.user:
        return redirect('/')

    if form.validate_on_submit():
        user = User.authenticate(form.username.data, form.password.data)

        if user:
            do_login(user)
            return redirect('/')
        else:
            form.form_errors.append(
                'Username and Password do not match. Please try again.')
            render_template('login.html', form=form)

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
    template = TemplateExercise()
    muscle_groups = [(res['id'], res['name_en'] if res['name_en']
                      else res['name']) for res in results['results']]
    form.muscle_groups.choices = sorted(muscle_groups, key=lambda mg: mg[1])
    template = Template.query.get_or_404(temp_id)
    if form.validate_on_submit():
        for ex in template.exercises:
            db.session.delete(ex)
        template_name = request.form.get('name')
        exercises = request.form.getlist('exercise')

        template.name = template_name
        for ex in exercises:
            data = json.loads(ex)
            temp_ex = TemplateExercise(exercise_id=data['id'],
                                       exercise_name=data['name'],
                                       muscle_group=data['muscle'])
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
    form.muscle_groups.choices = sorted(muscle_groups, key=lambda mg: mg[1])
    if form.validate_on_submit():
        # get values from request.form since some inputs are generated
        # dynamically in HTML

        # Need to check that there are indeed exercises selected. Maybe even a
        # front end validation by initially disabling create button.
        template_name = form.name.data
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
    results = requests.get(f'{WGER}/muscle?ordering=muscle').json()
    muscle_groups = [(res['id'], res['name_en'] if res['name_en']
                      else res['name']) for res in results['results']]
    muscle_groups = sorted(muscle_groups)
    exercise_form.muscle_groups.choices = sorted(
        muscle_groups, key=lambda mg: mg[1])
    if form.validate_on_submit():
        workout = Workout(user_id=g.user.id,
                          scheduled=form.scheduled.data, name=form.name.data)
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
def start_workout(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    form = TemplateForm()
    if request.method == 'POST':
        workout = Workout.query.get_or_404(workout_id)
        workout.completed = datetime.today()
        exercises = workout.exercises
        res_data = request.form.getlist('ex-info')
        for ex, ex_data in zip(exercises, res_data):
            data = json.loads(ex_data)
            for set, set_data in zip(ex.sets, data['sets']):
                set.target_weight = set_data['tw']
                set.completed_weight = set_data['cw']
                set.target_reps = set_data['tr']
                set.completed_reps = set_data['cr']
                set.target_RPE = set_data['trpe']
                set.completed_RPE = set_data['crpe']
                set.resttime = set_data['rt']
        db.session.commit()
        return redirect('/')
    return render_template('/workouts/start-workout.html', workout=workout)


@app.route('/workouts/delete/<int:workout_id>', methods=['POST'])
def delete_workout(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    db.session.delete(workout)
    db.session.commit()
    return redirect('/')


######################################################################################
# Other Routes

def create_plot():
    params = parse_qsl(request.url)

    if len(params) < 3:
        month = datetime.today().month
        year = datetime.today().year
        exercise = WorkoutExercise.query.filter(
            Workout.user_id == g.user.id).order_by(
            WorkoutExercise.exercise_name).first()
        if exercise:
            exercise = exercise.exercise_id
    else:
        month = int(params[0][1])
        year = int(params[1][1])
        exercise = int(params[2][1])

    range = monthrange(year, month)
    start_date = datetime(year, month, 1)
    end_date = datetime(year, month, range[1])

    query = WorkoutExercise.query.join(Workout).filter(
        Workout.user_id == g.user.id).filter(
        Workout.completed != None).filter(
        Workout.completed >= start_date).filter(
        Workout.completed <= end_date).filter(
        WorkoutExercise.exercise_id == exercise)
    exercises = query.all()

    if exercises:
        sets = []
        for exercise in exercises:
            for set in exercise.sets:
                sets.append(set)

        x = [set.exercise.workout.completed.strftime(
            '%m/%d/%Y') for set in sets]
        y = [set.completed_weight for set in sets]
        plot = px.scatter(x=x, y=y, labels={'x': 'Date',
                                            'y': f'{g.user.unit.abbr}s'},
                          title=set.exercise.exercise_name)
    else:
        plot = None

    workouts = Workout.query.filter(Workout.user_id == g.user.id).filter(
        Workout.completed != None).filter(
        Workout.completed >= start_date).filter(
        Workout.completed <= end_date).order_by(Workout.completed.desc()).all()
    return {'plot': plot,
            'workouts': workouts}


@app.route('/progress')
def get_progress():
    form = ProgressForm()
    exercises = WorkoutExercise.query.filter(
        Workout.user_id == g.user.id).distinct(WorkoutExercise.exercise_id).all()
    choices = [(exercise.exercise_id, exercise.exercise_name)
               for exercise in exercises]
    choices = sorted(choices, key=lambda ex: ex[1])
    form.exercise.choices = choices
    data = create_plot()
    plot = data['plot']
    workouts = data['workouts']
    if plot:
        plot.update_traces(marker={'size': 15})
        plot.write_html('./templates/plot.html')
    return render_template('progress.html', form=form, datetime=datetime, plot=plot, completed=workouts)


@app.route('/profile', methods=['GET', 'POST'])
def update_profile():
    form = UserInfoForm()
    if form.validate_on_submit():
        user = User.query.get(g.user.id)
        user.first_name = form.first_name.data if form.first_name.data else user.first_name
        user.last_name = form.last_name.data if form.last_name.data else user.last_name
        user.birthday = form.birthday.data if form.birthday.data else user.birthday
        user.height = form.height.data if form.height.data else user.height
        user.weight = form.weight.data if form.weight.data else user.weight
        user.preferred_units = form.preferred_unit.data
        db.session.commit()
        return redirect('/profile')
    return render_template('/profile.html', form=form)

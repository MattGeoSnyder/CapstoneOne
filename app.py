from flask import Flask, g, render_template, redirect, session, flash, request
from flask_debugtoolbar import DebugToolbarExtension
from secret_keys import app_secret_key
from models import db, connect_db, User, Template, TemplateExercise, Workout, WorkoutExercise, Set
from sqlalchemy.exc import IntegrityError
from forms import SignupForm, LoginForm, ExerciseSearchForm
from datetime import date, datetime
import requests
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
# Signup/login routes


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
            # pdb.set_trace()
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


########################################################################################
# Main app routes

@app.route('/')
def home():
    if not g.user:
        return redirect('/login')
    return render_template('home.html')


@app.route('/templates/new', methods=['GET', 'POST'])
def create_template():
    form = ExerciseSearchForm()
    results = requests.get(f'{WGER}/muscle').json()
    muscle_groups = [(res['id'], res['name_en'] if res['name_en']
                      else res['name']) for res in results['results']]
    form.muscle_groups.choices = muscle_groups
    pdb.set_trace()
    if form.validate_on_submit():
        template = Template(name=form.workout-name.data)

    return render_template('/main/new-template.html', form=form)

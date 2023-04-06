from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table
from flask_bcrypt import Bcrypt
import pdb

bcrypt = Bcrypt()
db = SQLAlchemy()


def connect_db(app):
    db.app = app
    db.init_app(app)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(15), nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String(15), nullable=True)
    last_name = db.Column(db.String(15), nullable=True)
    birthday = db.Column(db.Date, nullable=True)
    height = db.Column(db.String, nullable=True)
    weight = db.Column(db.Integer, nullable=True)
    preferred_units = db.Column(
        db.Integer, db.ForeignKey('units.id'), default=1)

    unit = db.relationship('Unit')

    @classmethod
    def signup(cls, first_name, last_name, username, password,
               birthday, height, weight, preferred_units):
        hashed_pw = bcrypt.generate_password_hash(password).decode('utf8')

        user = User(first_name=first_name,
                    last_name=last_name,
                    username=username,
                    password=hashed_pw,
                    birthday=birthday,
                    preferred_units=preferred_units)

        db.session.add(user)
        return user

    @classmethod
    def authenticate(cls, username, password):
        user = cls.query.filter(cls.username == username).first()
        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user
        return False

    def name(self):
        return f'{self.first_name} {self.last_name}'


class Template(db.Model):
    __tablename__ = 'templates'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    exercises = db.relationship(
        'TemplateExercise', backref='template', cascade='all, delete')


class TemplateExercise(db.Model):
    __tablename__ = 'temp_exercises'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    template_id = db.Column(db.Integer, db.ForeignKey(
        'templates.id'), nullable=False)
    exercise_id = db.Column(db.Integer, nullable=False)
    exercise_name = db.Column(db.String, nullable=False)
    muscle_group = db.Column(db.String, nullable=False)


class Workout(db.Model):
    __tablename__ = 'workouts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    scheduled = db.Column(db.Date, nullable=True)
    completed = db.Column(db.Date, nullable=True)

    exercises = db.relationship('WorkoutExercise', backref='workout')
    user = db.relationship('User', backref='workouts')


class WorkoutExercise(db.Model):
    __tablename__ = 'work_exercises'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'))
    exercise_id = db.Column(db.Integer, nullable=False)
    muscle_group = db.Column(db.String, nullable=False)
    exercise_name = db.Column(db.String, nullable=False)

    sets = db.relationship('Set', backref='exercise')


class Set(db.Model):
    __tablename__ = 'sets'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    workout_exercises = db.Column(db.Integer,
                                  db.ForeignKey('work_exercises.id'))
    exercise_id = db.Column(db.Integer, nullable=True)
    target_weight = db.Column(db.Integer, nullable=True)
    completed_weight = db.Column(db.Integer, nullable=True)
    target_reps = db.Column(db.Integer, nullable=True)
    completed_reps = db.Column(db.Integer, nullable=True)
    target_RPE = db.Column(db.Float, nullable=True)
    completed_RPE = db.Column(db.Float, nullable=True)
    resttime = db.Column(db.Integer, nullable=True)


class Unit(db.Model):
    __tablename__ = 'units'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    abbr = db.Column(db.String, nullable=False)

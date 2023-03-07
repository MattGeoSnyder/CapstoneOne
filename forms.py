from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, DateField, FloatField, IntegerField
from wtforms.validators import ValidationError, InputRequired, Length, Optional


def filter_empty(x):
    return x if x else None


class PasswordConfirmation(object):
    def __init__(self, message=None):
        self.message = message

    def __call__(self, form, field):
        if form.password.data != form.confirm_password.data:
            raise ValidationError(self.message)


class SignupForm(FlaskForm):
    username = StringField('Username',
                           validators=[InputRequired('Field Required'),
                                       Length(6, 15, 'Username must be between 6 and 15 characters')])
    password = PasswordField('Password',
                             validators=[InputRequired('Field Required'),
                                         Length(
                                             8, 20, 'Password must be between 8 and 20 characters'),
                                         PasswordConfirmation('Passwords do not match')])
    confirm_password = PasswordField('Confirm Password',
                                     validators=[InputRequired('Field Required'),
                                                 Length(
                                         8, 20, 'Password must be between 8 and 20 characters'),
                                         PasswordConfirmation('Passwords do not match')])
    first_name = StringField('First Name',
                             validators=[Length(
                                 max=15, message="Name exceeds character limit.")])
    last_name = StringField('Last Name',
                            validators=[Length(
                                max=15, message="Name exceeds character limit.")])
    birthday = DateField("Birthday", validators=[Optional()])
    height = StringField("Height")
    weight = IntegerField("Weight", validators=[Optional()])
    preferred_unit = SelectField("Preferred Unit",
                                 choices=[(1, "lb"), (2, 'kg')])


class LoginForm(FlaskForm):
    username = StringField('Username',
                           validators=[InputRequired('Field Required'),
                                       Length(6, 15, 'Username must be between 6 and 15 characters')])
    password = PasswordField('Password',
                             validators=[InputRequired('Field Required'),
                                         Length(8, 20, 'Password must be between 8 and 20 characters')])


class TemplateForm(FlaskForm):
    name = StringField("Name", validators=[InputRequired()])
    muscle_groups = SelectField("Muscle Group", validators=[Optional()])

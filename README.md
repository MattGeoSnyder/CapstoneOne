# Fitter

I created a free fitness web-app designed to make logging your workouts quick and easy.

You can find my app at: [fitter.herokuapp.com](https://fitter.herokuapp.com)

## Motivation

I wanted to create a fitness app that I would want to use. There are a couple of pain points that I've experienced using fitness apps:

1. It takes too long to log your workout information.
2. It's often not easy to change your workout information once entered.
3. They aren't always designed to go through your workout with you.

## User Flow

Fitter allows you to create "Routines". "Routines" are a way for you to create a workout template for a set of exericses that you normally do when you go to the gym. From a routine you can quickly create and schedule a workout by entering your set and rep information (However, you do also have the ability to create a workout without a template). Your set and rep information are the set as flexible goals, or target values. This means that you have the ability to enter in the amount of weight and reps that you actually complete later on.

Once you create a workout, it'll show up on your homepage for you to complete. After clicking on the workout, your exercise information will be pulled up. If you opt to enter in rest times for your sets, upon completing your set a timer will be displayed to keep your workout on track.

After completing your workout, your finished workout information will be available on your homescreen for your most recently completed workouts. You can also view all of your completed workouts on the progress tab, with a plot summarizing your progress for exercises.

## Technologies Used

This project was built using [Flask v2.2.2] and uses the following technologies:

- Frontend:
  - HTML
  - CSS
  - Bootstrap
  - Javascript
- Backend:
  - Python
  - PostgreSQL
  - Flask SQLAlchemy

I also used the [WGER](https://wger.de/api/v2) API to source the exercise data.

## Setup

If you'd like to run the application locally you can follow these steps:

1. Install Python and PostgreSQL
2. Create a virtual environment in python

   > ```console
   > python -m venv venv
   > ```

3. Install requirements

   > ```console
   > pip install -r requirements.txt
   > ```

4. Create your Postgresql database

   > ```console
   > createdb CapstoneOne
   > ```

5. Seed the database

   > ```console
   > psql < seed_units.psql
   > ```

6. In app.py change config to

   > ```python
   > app.config['SQLALCEMY_DATABASE_URI'] = "postgresql:///CapstoneOne"
   > ```

## Models

[Schema](./static/resources/SchemaDiagram.pdf)

## Server Routes

| Method                  | URL                                   | Description                                                                                                                                                                                                   |
| :---------------------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| home()                  | /                                     | Takes you to home page. If not logged in, will redirect to /login                                                                                                                                             |
| login()                 | /login                                | Login page.                                                                                                                                                                                                   |
| signup()                | /signup                               | Sign up page.                                                                                                                                                                                                 |
| templates()             | /templates                            | Page to view and manage templates ("Routines")                                                                                                                                                                |
| edit_template()         | /templates/<int:temp_id>              | Edit specific template                                                                                                                                                                                        |
| create_template()       | /templates/new                        | Create new template                                                                                                                                                                                           |
| delete_template()       | /templates/<int:temp_id>/delete       | Delete specific Template                                                                                                                                                                                      |
| create_workout()        | /workouts/new                         | Create new workout                                                                                                                                                                                            |
| return_templates()      | /workouts/new/templates               | redirects to /templates to create new workout from template                                                                                                                                                   |
| create_from_templates() | /workouts/new/templates/<int:temp_id> | Querys template to make workout from. Will POST new workout to /workouts/new                                                                                                                                  |
| start_workout()         | /workouts/<int:workout_id>            | Querys specific workout and displays workout information. On POST will add completed workout information.                                                                                                     |
| delete_workout()        | /workouts/delete/<int:workout_id>     | Deletes specific workotu                                                                                                                                                                                      |
| get_progress            | /progress                             | Querys specific exercise for progress. Defaults to first exercise by name alphabetically. Calls upon create_plot to make progress plot. Displays prgress plot and completed workouts within search parameters |
| update_profile()        | /profile                              | Gets additional user information. On post will update user information.                                                                                                                                       |

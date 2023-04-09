# Fitter

I created a free fitness web-app designed to make logging your workouts quick and easy.

### You can find my app at: fitter.herokuapp.com

## Motivation

I wanted to create a fitness app that I would want to use. There are a couple of pain points that I've experienced using fitness apps:

1. It takes too long to log your workout information.
2. It's often not easy to change your workout information.
3. They aren't always designed to go through your workout with you.

## User Flow

Fitter allows you to create "Routines". "Routines" are a way for you to create a workout template for a set of exericses that you normally do when you go to the gym. From a routine you can quickly create and schedule a workout by entering your set and rep information (However, you do also have the ability to create a workout without a template). Your set and rep information are the set as flexible goals, or target values. This means that you have the ability to enter in the amount of weight and reps that you actually complete later on.

Once you create a workout, it'll show up on your homepage for you to complete. After clicking on the workout, your exercise information will be pulled up. If you opt to enter in rest times for your sets, upon completing your set a timer will be displayed to keep your workout on track.

After completing your workout, your finished workout information will be available on your homescreen for your most recently completed workouts. You can also view all of your completed workouts on the progress tab, with a plot summarizing your progress for exercises.

## Technologies Used

This project was built using [Flask v2.2.2] and uses the following technologies:

- Frontend:
  - HTML, CSS, Bootstrap, Javascript
- Backend:
  - Python, PostgreSQL, Flask SQLAlchemy

## Models

![Models](/preliminary/SchemaDiagram.pdf)

https://wger.de/api/v2/

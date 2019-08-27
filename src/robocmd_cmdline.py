import click
from megapi import *

print("Bot init")
bot = MegaPi()

print("Bot start")
bot.start()

print("Bot listens")
while True:
    c  = click.getchar()
    click.echo()
    if c == 's':
        click.echo('STOP ALL!')
        stopAll()
    elif c == 'q':
        click.echo('Abort!')
        stopAll()
        break
    elif c == '\x1b[D':
        click.echo('LEFT')
        left()
    elif c == '\x1b[C':
        click.echo('RIGHT')
        right()
    elif c == '\x1b[A':
        click.echo('FORWARD')
        forward()
    elif c == '\x1b[B':
        click.echo('BACKWARD')
        backward()
    elif c == 'u':
        click.echo('ARM UP')
        armUp()
    elif c == 'd':
        click.echo('ARM DOWN')
        armDown()
    elif c == 'o':
        click.echo('GRIPPER OPEN')
        gripperOpen()
    elif c == 'c':
        click.echo('GRIPPER CLOSE')
        gripperClose()

def left():
    bot.encoderMotorRun(1, 30)
    bot.encoderMotorRun(2, 30)

def right():
    bot.encoderMotorRun(1, -30)
    bot.encoderMotorRun(2, -30)

def forward():
    bot.encoderMotorRun(2, -150)
    bot.encoderMotorRun(1, 150)

def backward():
    bot.encoderMotorRun(2, 150)
    bot.encoderMotorRun(1, -150)

def armUp():
    bot.encoderMotorRun(3, -76)

def armDown():
    bot.encoderMotorRun(3, 76)

def armStop():
    bot.encoderMotorRun(3, 0)

def gripperOpen():
    bot.encoderMotorRun(4, 150)

def gripperClose():
    bot.encoderMotorRun(4, -20)

def gripperStop():
    bot.encoderMotorRun(4, 0)

def stopAll():
    stopMove()
    stopArm()
    stopGripper()

def stopMove():
    bot.encoderMotorRun(1, 0)
    bot.encoderMotorRun(2, 0)

def stopArm():
    bot.encoderMotorRun(3, 0)

def stopGripper():
    bot.encoderMotorRun(4, 0)

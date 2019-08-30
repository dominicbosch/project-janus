import click
from megapi import *

class Robo:
    def __init__(self):
        print("Bot init")
        self.bot = MegaPi()
        print("Bot start")
        self.bot.start()

    def left(self):
        self.bot.encoderMotorRun(1, 30)
        self.bot.encoderMotorRun(2, 30)

    def right(self):
        self.bot.encoderMotorRun(1, -30)
        self.bot.encoderMotorRun(2, -30)

    def forward(self):
        self.bot.encoderMotorRun(2, -150)
        self.bot.encoderMotorRun(1, 150)

    def backward(self):
        self.bot.encoderMotorRun(2, 150)
        self.bot.encoderMotorRun(1, -150)

    def armUp(self):
        self.bot.encoderMotorRun(3, -76)

    def armDown(self):
        self.bot.encoderMotorRun(3, 76)

    def armStop(self):
        self.bot.encoderMotorRun(3, 0)

    def gripperOpen(self):
        self.bot.encoderMotorRun(4, 150)

    def gripperClose(self):
        self.bot.encoderMotorRun(4, -20)

    def gripperStop(self):
        self.bot.encoderMotorRun(4, 0)

    def stopAll(self):
        self.stopMove()
        self.stopArm()
        self.stopGripper()

    def stopMove(self):
        self.bot.encoderMotorRun(1, 0)
        self.bot.encoderMotorRun(2, 0)

    def stopArm(self):
        self.bot.encoderMotorRun(3, 0)

    def stopGripper(self):
        self.bot.encoderMotorRun(4, 0)

robo = Robo()

print("Bot listens")
while True:
    c  = click.getchar()
    click.echo()
    if c == 's':
        click.echo('STOP ALL!')
        robo.stopAll()
    elif c == 'q':
        click.echo('Abort!')
        robo.stopAll()
        break
    elif c == '\x1b[D':
        click.echo('LEFT')
        robo.left()
    elif c == '\x1b[C':
        click.echo('RIGHT')
        robo.right()
    elif c == '\x1b[A':
        click.echo('FORWARD')
        robo.forward()
    elif c == '\x1b[B':
        click.echo('BACKWARD')
        robo.backward()
    elif c == 'u':
        click.echo('ARM UP')
        robo.armUp()
    elif c == 'd':
        click.echo('ARM DOWN')
        robo.armDown()
    elif c == 'o':
        click.echo('GRIPPER OPEN')
        robo.gripperOpen()
    elif c == 'c':
        click.echo('GRIPPER CLOSE')
        robo.gripperClose()

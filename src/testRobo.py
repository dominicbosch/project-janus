
from megapi import *

def handleStop():
        global bot
        print("Wow")
        # bot.encoderMotorRun(1, 0)

print("init")
bot = MegaPi()
#bot.start("/dev/ttyS0")

print("start")
bot.start()

print("move")
bot.encoderMotorMove(1, 200, 100, handleStop)
#sleep(5)
#bot.encoderMotorRun(1, 0)
#sleep(1)
#bot.encoderMotorRun(1,200)
#sleep(10)
#bot.encoderMotorRun(1, 0)

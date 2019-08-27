import os
import sys
import tty
import time
import termios
from megapi import *

print("Bot init")
bot = MegaPi()

print("Bot start")
bot.start()

print("Bot listens")
fd = sys.stdin.fileno()
old_settings = termios.tcgetattr(fd)

try:
    while True:
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(1)
            print(ch)
            break
        except IOError: pass
finally:
    termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)

    # for line in sys.stdin:
    #     print("Bot got command '{}'".format(line))
    #     arr = line.split(',')
    #     cmdid = arr[0]
    #     motor = int(arr[1])
    #     val = float(arr[2])
    #     if cmdid is not None and motor is not None and val is not None:
    #         bot.encoderMotorRun(motor, int(val*255))
    #         print('DONE,{}'.format(cmdid))
    #     else:
    #         print("Error!")

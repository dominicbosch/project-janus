import os
import sys
import time
import termios
import fcntl
from megapi import *

print("Bot init")
bot = MegaPi()

print("Bot start")
bot.start()

print("Bot listens")
fd = sys.stdin.fileno()

oldterm = termios.tcgetattr(fd)
newattr = termios.tcgetattr(fd)
newattr[3] = newattr[3] & ~termios.ICANON & ~termios.ECHO
termios.tcsetattr(fd, termios.TCSANOW, newattr)

oldflags = fcntl.fcntl(fd, fcntl.F_GETFL)
fcntl.fcntl(fd, fcntl.F_SETFL, oldflags | os.O_NONBLOCK)

try:
    while True:
        try:
            c = sys.stdin.read(1)
            print(c)
            break
        except IOError: pass
finally:
    termios.tcsetattr(fd, termios.TCSAFLUSH, oldterm)
    fcntl.fcntl(fd, fcntl.F_SETFL, oldflags)

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

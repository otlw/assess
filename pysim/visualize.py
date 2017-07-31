import matplotlib.pyplot as plt
import numpy as np
import csv
import sys


# script to plot the effect of an assessors weight on the likelyhood of being called
# usage: python visualize.py pathToCSVFile

# read data
datafile = "../tmp.csv"
if len(sys.argv) > 1:
   datafile = sys.argv[1]

rows = []
with open(datafile, 'rb') as f:
   csvreader = csv.reader(f)
   for row in csvreader:
       rows.append(row[:-1])

calls = rows[0]
weights = rows[1]
accountIndices = rows[2]
title = rows[3]
# print rows

f1=plt.figure(1)
ax = plt.subplot(1,2,1)
ax.set_title(title)

# option 2: display in account order (web3.accounts)
# sort by index in web3.accounts
# srt, weights, calls = zip( *sorted( zip(accountIndices, weights, calls) ) )
# ax.scatter(srt,weights, c='r', label = "weight in concept" )
# ax.scatter(srt, calls, c='b', label = "#called" )

# option 1: weights vs. calls
ax.set_xlabel("weight")
ax.set_ylabel("calls")
ax.scatter(weights,calls, c='r')#, label = "weight in concept" )

# plt.legend(bbox_to_anchor=(1.05,1. ), loc=2, borderaxespad=0.)
# plt.legend()
plt.show()

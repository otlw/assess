import matplotlib.pyplot as plt
import numpy as np
import csv

# read data

rows = []
with open("../tmp.csv", 'rb') as f:
   csvreader = csv.reader(f)
   for row in csvreader:
       rows.append(row[:-1])

calls = rows[0]
weights = rows[1]
accountIndices = rows[2]
title = rows[3]
print rows

# sort by index in web3.accounts
srt, weights, calls = zip( *sorted( zip(accountIndices, weights, calls) ) )

f1=plt.figure(1)
ax = plt.subplot(1,2,1)
ax.set_title(title)
ax.set_xlabel("assessor") 
# ax.scatter(weights,calls, c='r', label = "weight in concept" )
ax.scatter(srt,weights, c='r', label = "weight in concept" )
ax.scatter(srt, calls, c='b', label = "#called" )
plt.legend(bbox_to_anchor=(1.05,1. ), loc=2, borderaxespad=0.)
# plt.legend()
plt.show()

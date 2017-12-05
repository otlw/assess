import matplotlib.pyplot as plt
import numpy as np

#generates the payout graphs of the whitepaper

def MAD(scores):
    return np.mean(np.abs(scores - np.mean(scores)))

def biggestCluster(scores, distanceFunction=MAD, verbose=False):
    dist = distanceFunction(scores)
    n = len(scores)
    clusters = [[] for i in range(n)]
    for i in range(n):
        for j in range(i,n):
            if np.abs(scores[i] - scores[j]) <= dist:
                clusters[j].append(scores[i])
                clusters[i].append(scores[j])

    if verbose:
        printClusters(clusters, dist, distanceFunction == MAD)

    winnerCluster = max(clusters, key=len)
    return winnerCluster


def returnedStake(score, finalScore, mad, cost, inRewardCluster = True):
    """payout function as implented in assessment.sol"""
    scoreDistance = 0;
    if mad > 0:
        scoreDistance = int((np.abs(score - finalScore)*1000)/mad)
    if inRewardCluster:
        return (cost * max(1000 - scoreDistance, 0))/1000
    else:
        return (cost * max(2000 - scoreDistance, 0))/2000


# score dependant on distance
def inRS(dist):
    return 1 + (1000 - int(dist*1000))/1000.0

def outRS(dist):
    return (2000 - int(dist*1000))/2000.0

N = 200
xsin = np.arange(0,0.999,1./N)
xsout = np.arange(1,2,1./N)
ysin = [inRS(i) for i in xsin]
ysout = [outRS(i) for i in xsout]

lens =[ len(i) for i in [xsin, ysin, xsout, ysout]]
print lens

f1=plt.figure(1)
ax = plt.subplot(1,1,1)
# ax.set_title("vs distance from final score")
ax.plot(xsin, ysin)
ax.scatter(1,1, edgecolors='blue',facecolors='none')
# ax.scatter(1,.5)
ax.plot(xsout, ysout)
ax.set_xlabel("distance from final score / MAD")
ax.set_xlim([0, 2])
ax.set_ylim([0, 2])
ax.set_ylabel("payout / stake")
plt.show()

#payout dependant on size of winning cluster

inScore = 80
outScore = 70

size = 40

def composeScores(inN, outN):
    return [inScore for i in range(inN)] + [outScore for i in range(outN)]


payoutWinner = []
payoutLosers = []
sizeOfWC = []
scores = [composeScores(size-i,i) for i in range(size/2)]
for run in scores:
    mad = MAD(run)
    winCluster = biggestCluster(run)
    sizeOfWC.append((len(winCluster)-1)/float(len(run)))
    #get proportion of returned stake(max=1)
    rs_w = returnedStake(inScore,inScore,mad,1,True) -1
    rs_l = returnedStake(outScore,inScore,mad,1,False)
    #redistribute from dissenting assessors
    rs_w += (size-len(winCluster))*(1-rs_l)/float(len(winCluster))
    #save
    payoutLosers.append(rs_l)
    payoutWinner.append(rs_w)

ax = plt.subplot(1,1,1)
# ax.set_title("vs size of winning Cluster")
ax.plot(sizeOfWC, payoutWinner)
# ax.plot(sizeOfWC, payoutLosers)
ax.set_xlabel("size of biggest cluster in %")
ax.set_ylabel("redistributed stake per assessor")
ax.set_ylim([-0.05, .9])
plt.show()


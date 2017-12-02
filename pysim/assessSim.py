import numpy as np
import sys

# simulates the scoring process of an assessment. Can be used to
# a) to test different clustering functions with testCalculateResults()
#    -> usage: comment/uncomment in main() and execute without arguments
#
# b) to compute the finalScore and the winningAsssossors for a given series of scores
#   usage: pass scores as a comma separated string to the command line, e.g.
#  > python assessment.py 0,1,0,0,1

# c) some edge cases with more complicated scores that are interesting to look at
# usage: umcomment main() and set edge=True

# ============== scoring and clustering functions ===================


def MAD(scores):
    return np.mean(np.abs(scores - np.mean(scores)))


def MMD(scores):
    return np.median(np.abs(scores - np.median(scores)))


def printClusters(cs, dist, usedMAD):
    if usedMAD:
        print "clusterRadius (MAD): ", dist
    else:
        print "clusterRadius (MMD): ", dist
    for idx, c in enumerate(cs):
        print "Cluster ", idx, ": ", c
    print "Clusterlengths: ", [len(c) for c in cs]
    print "winning Cluster: ", max(cs, key=len)


def clusterSOL(scores, distanceFunction=MAD, verbose=False):
    dist = distanceFunction(scores)
    n = len(scores)
    clusters = [[] for i in range(n)]
    for l in range(n):
        for m in range(n):
            if scores[l] - scores[m] <= dist:  # shouldnt this be abs()?->no still works? why?
                clusters[l].append(scores[m])
    if verbose:
        printClusters(clusters, dist, distanceFunction == MAD)
    return clusters


def clusterSOL(scores, distanceFunction=MAD, verbose=False):
    """ 
    clustering as currently implemented in assessment.sol
    corrected for the fact that python does not underflow
    """
    dist = distanceFunction(scores)
    n = len(scores)
    clusters = [[] for i in range(n)]
    for l in range(n):
        for m in range(n):
            if np.abs(scores[l] - scores[m]) <= dist:
                clusters[l].append(scores[m])

    if verbose:
        printClusters(clusters, dist, distanceFunction == MAD)

    return clusters

def cluster1(scores, distanceFunction=MAD, verbose=False):
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

    return clusters

def clusterMask(scores, distanceFunction=MAD, verbose=False):
    n = len(scores)
    dist = distanceFunction(scores)
    bestMask = np.zeros(n)
    for i in range(n):
        currentMask = np.zeros(n)
        for j in range(n):
            if np.abs(scores[i] - scores[j]) <= dist:
                currentMask[j] = 1
        if np.sum(currentMask) > np.sum(bestMask):
            bestMask = currentMask

    clusters = [score for idx,score in enumerate(scores) if bestMask[idx] == 1 ]
    if verbose:
        printClusters(clusters, dist, distanceFunction == MAD)
    return clusters

def calculateResult(
        scores, clusterFunction=clusterSOL, distanceFunction=MAD, verbose=False
):
    clusters = clusterFunction(scores, distanceFunction, verbose)
    winnerCluster = max(clusters, key=len)
    winnerAssessors = [i for i, score in enumerate(
        scores) if score in winnerCluster]
    finalScore = np.mean(winnerCluster)
    return finalScore, winnerAssessors

# ============== test-functions ====================


def testMAD():
    scores1 = [1, 2, 3]
    scores2 = [1, 1, 1]
    assert MAD(scores1) == 2. / 3
    assert MAD(scores2) == 0
    print "MAD works..."


def testCalculateResults(
        clusterFunction=clusterSOL,
        distanceFunction=MAD,
        verbose=False
):
    '''
    Tests calcualte results - currently only for 1/0 scores
    '''
    print "testing function: ", clusterFunction
    # testcases are triplets:
    # (scoringArray, expected finalScore, expected winningAssessors)
    cases = [
        ([1, 1], 1, [0, 1]),
        ([1, 1, -1], 1, [0, 1]),
        ([0, 1, 1, 1], 1, [1, 2, 3]),
        ([1, 1, 1, 0], 1, [0, 1, 2]),
        #        ([1,1,0,0,], ??, [?,?]), #TODO what happens at a  draw?
        ([1, 0, 0, 0, 1], 0, [1, 2, 3])
    ]
    for scores, true_finalScore, true_winningAssessors in cases:
        print "\n ======= test: ", scores, " ============="
        finalScore, winnerAssessors = calculateResult(
            scores, cluster1, distanceFunction, verbose)
        if verbose:
            print "finalScore: ", finalScore, "\nwinning Assessors: ",  winnerAssessors
        assert finalScore == true_finalScore
        assert winnerAssessors == true_winningAssessors
    print "Results are correctly computed..."
    return True

def payout(score, finalScore, mad, cost, inRewardCluster = True):
    """payout function as implented in assessment.sol"""
    scoreDistance = int((np.abs(score - finalScore)*1000)/mad)
    if inRewardCluster:
        return (cost * max(1000 - scoreDistance, 0))/1000
    else:
        return (cost * max(2000 - scoreDistance, 0))/2000

def getPayouts(scores, finalScore, cost, winningCluster):
    # inCluster[score in winningCluster for score in scores]
    return [payout(score, finalScore, cost, score in winningCluster) for score in scores]



# ======== MAIN ============
def main():
    if len(sys.argv) > 1:
        # ============== b) read scores from input ===================
        print "reading from CL..."
        distanceFunction = MAD
        clusterFunction = clusterSOL
        scores = np.asarray([float(s) for s in sys.argv[1].split(',')])
        try:
            if sys.argv[2] == "mad":
                distanceFunction = MAD
            if sys.argv[2] == "mmd":
                distanceFunction = MMD
            if sys.argv[3] == "0":
                clusterFunction = clusterSOL
            if sys.argv[3] == "1":
                clusterFunction = cluster1
            if sys.argv[3] == "2":
                clusterFunction = cluster2
        except:
            print ""
        print "cluster-Function: ", clusterFunction
        print "scores: ", scores
        finalScore, winnerAssessors = calculateResult(
            scores, clusterFunction, distanceFunction, verbose=True
        )
        print "winningScores: ", scores[winnerAssessors]
        print "finalScore: ", finalScore, "\nwinning Assessors: ",  winnerAssessors
        print "payouts(% of cost (without stake/burning)): ", getPayouts(scores, finalScore, 1, scores[winnerAssessors])
    else:
        # ============== b) test clustering functions ===================
        print "testing the implemented functions..."
        testMAD()
        verbose = True
        testCalculateResults(clusterSOL, MAD, verbose=verbose)

        # testCalculateResults(cluster1, MAD, verbose=verbose)
main()


# ================= edge cases ========================
# here I enter tricky cases that might break the system. one assessor going crazy high.
# to see the effect on the score and the cluster
edge = False

# compare-flag: true -> runs both clusterSOL and cluster1
# and prints the results next to each other
verbose = True
if edge:
    print "Looking at edge cases..."
    cases = [
        # this one looks bad for clusterSOL and good for cluster1?
        np.asarray([1, 1, 1, 1, 0, 1000]),
        # this one will have many three winning clusters, each with 3 scores -> DRAW?
        np.asarray([1, 2, 3, 4, 5]),
        # how to deal with a draw
        np.asarray([1, 1, 1, 2, 2, 2])

    ]
    for scores in cases:
        print "===== ", scores, " =========="
        finalScore, winnerAssessors = calculateResult(
            scores, cluster1, MMD, verbose  # <change here betwen clusterSOL/1
        )
        print "winningScores: ", scores[winnerAssessors]
        print "finalScore: ", finalScore
        print "winning Assessors: ",  winnerAssessors

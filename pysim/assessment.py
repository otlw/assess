import numpy as np
import sys

# simulates the scoring process of an assessment. Can be used to
# a) to test different clustering functions with testCalculateResults()
# b) to compute the avgScore and the winningAsssossors for a given series of scores
#   (passed as a comma separated string to the command line, e.g.
#  > python assessment.py 0,1,0,0,1

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
    """ clustering as currently implemented in assessment.sol """
    dist = distanceFunction(scores)
    n = len(scores)
    clusters = [[] for i in range(n)]
    for l in range(n):
        for m in range(n):
            if scores[l] - scores[m] <= dist:  # this should be abs()?
                clusters[l].append(scores[m])
    if verbose:
        printClusters(clusters, dist, distanceFunction == MAD)
    return clusters


def cluster1(scores, distanceFunction=MAD, verbose=False):
    """ corrected clustering function
        possibly a faster implementation
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


def calculateResult(
        scores, clusterFunction=clusterSOL, distanceFunction=MAD, verbose=False
):
    clusters = clusterFunction(scores, distanceFunction, verbose)
    winnerCluster = max(clusters, key=len)
    winnerAssessors = [i for i, score in enumerate(
        scores) if score in winnerCluster]
    avgScore = np.mean(winnerCluster)
    return avgScore, winnerAssessors

# ============== a) TESTS ====================


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
    # (scoringArray, expected avgScore, expected winningAssessors)
    cases = [
        ([1, 1], 1, [0, 1]),
        ([0, 1, 1, 1], 1, [1, 2, 3]),
        ([1, 1, 1, 0], 1, [0, 1, 2]),
        #        ([1,1,0,0,], ??, [?,?]), #TODO what happens at a  draw?
        ([1, 0, 0, 0, 1], 0, [1, 2, 3])
    ]
    for scores, true_avgScore, true_winningAssessors in cases:
        print "\n ======= test: ", scores, " ============="
        avgScore, winnerAssessors = calculateResult(
            scores, cluster1, distanceFunction, verbose)
        if verbose:
            print "avgScore: ", avgScore, "\nwinning Assessors: ",  winnerAssessors
        assert avgScore == true_avgScore
        assert winnerAssessors == true_winningAssessors
    print "Results are correctly computed..."
    return True


# ============== b) read scores from input ===================
# enter scores as string
if len(sys.argv) > 1:
    print "reading from CL..."
    scores = np.asarray([float(s) for s in sys.argv[1].split(',')])
    print scores
    avgScore, winnerAssessors = calculateResult(
        scores, cluster1, MAD, verbose=True
    )
    print "winningScores: ", scores[winnerAssessors]
    print "avgScore: ", avgScore, "\nwinning Assessors: ",  winnerAssessors
else:
    print "testing the implemented functions..."
    testMAD()
    verbose = True
    testCalculateResults(clusterSOL, MAD, verbose=verbose)
    # testCalculateResults(cluster1, MAD, verbose=verbose)


# ================= edge cases ========================

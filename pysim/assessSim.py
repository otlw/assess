import numpy as np
import sys

# simulates the scoring process of an assessment. Can be used to
# to compute the finalScore and the winningAsssossors for a given series of scores
# with different scoring ranges and widths for the agreement-cluster
#   usage: pass scores as a comma separated string to the command line, e.g.
# optionally, a range can be specified by passing: r=<lowerLimit>,<upperLimit>
# optionally, the radius of the consensus cluster can be specified as
# percentage of the range of scores by passing c=<radiusIn%>
#  python assessment.py 0,1,0,0,1 r=0,100 c=10

#note: if both options are specified, range must be specified before radius
# some examples can be shown by running assessSim without arguments
# ============== scoring and clustering functions ===================

def MAD(scores):
    return np.mean(np.abs(scores - np.mean(scores)))


def MMD(scores):
    return np.median(np.abs(scores - np.median(scores)))


def printClusters(cs, radius):
    print "clusterRadius : ", radius
    for idx, c in enumerate(cs):
        print "Cluster ", idx, ": ", c
    print "Clusterlengths: ", [len(c) for c in cs]
    print "biggest Cluster: ", max(cs, key=lambda x: (len(x))) #, -1*MAD(x), 1-np.mean(x)))

# draw points around individual scores of radius R to create clusters
# returns all possible clusters
def cluster(scores, radius, verbose=False):
    n = len(scores)
    clusters = [[] for i in range(n)]
    for i in range(n):
        for j in range(n):
            # if (i != j):
                if np.abs(scores[i] - scores[j]) <= radius:
                    clusters[i].append(scores[j])

    if verbose:
        printClusters(clusters, radius)

    return clusters

# calculates the final score and the winning assessors
def calculateResult(scores, radius, threshold, verbose=False, clusterFunction=cluster):
    clusters = clusterFunction(scores, radius, verbose)
    #sort by size of cluster, then smaller innerMAD, then smaller value
    biggestCluster = max(clusters, key=len)
    winnerCluster = []
    finalScore = -99999
    if len(biggestCluster) > len(scores)/2:
        winnerCluster = biggestCluster
        finalScore = np.mean(winnerCluster)
    winnerAssessors = [i for i, score in enumerate(
        scores) if (np.abs(finalScore - score)<radius)]
    return finalScore, winnerAssessors

# outdated
def payout(score, finalScore, radius, cost, inRewardCluster = True):
    """payout function as implented in assessment.sol"""
    scoreDistance = int((np.abs(score - finalScore)*1000)/radius)
    if inRewardCluster:
        return (cost * max(1000 - scoreDistance, 0))/1000
    else:
        return (cost * max(2000 - scoreDistance, 0))/2000

# outdated
def getPayouts(scores, finalScore, cost, winningCluster):
    # inCluster[score in winningCluster for score in scores]
    return [payout(score, finalScore, cost, score in winningCluster) for score in scores]

# ============== test-functions ====================

def testMAD():
    scores1 = [1, 2, 3]
    scores2 = [1, 1, 1]
    assert MAD(scores1) == 2. / 3
    assert MAD(scores2) == 0
    print "MAD works..."


def testCalculateResults(radius, threshold, verbose=False, clusterFunction=cluster):
    '''
    Tests calcualte results - currently only for 1/0 scores
    '''
    print "testing function: ", clusterFunction
    # testcases are triplets:
    # (scoringArray, expected finalScore, expected winningAssessors)
    cases = [
        ([10, 10], 10, [0, 1]),
        ([90, 90, 10], 90, [0, 1]),
        ([0, 90, 90, 90], 90, [1, 2, 3]),
        ([90, 90, 90, 0], 90, [0, 1, 2]),
        ([90, 0, 0, 0, 90], 0, [1, 2, 3])
    ]
    for scores, true_finalScore, true_winningAssessors in cases:
        print "\n ======= test: ", scores, " ============="
        finalScore, winnerAssessors = calculateResult(
            scores, radius, threshold, verbose, clusterFunction)
        if verbose:
            print "finalScore: ", finalScore, "\nwinning Assessors: ",  winnerAssessors
        assert finalScore == true_finalScore
        assert winnerAssessors == true_winningAssessors
    print "Results are correctly computed..."
    return True
# =================== default variables ==================
# default max and min score (not enforced!)
scoreLimits = [0,100]
# percentage of distance within which the majority must reside
consensusRangeInPercent = 10



# ======== MAIN ============
def main(scoreLimits=[0,100], consensusRangeInPercent=10):
    if len(sys.argv) > 1:
        # ============== b) read scores from input ===================
        print "reading from CL..."
        scores = np.asarray([float(s) for s in sys.argv[1].split(',')])
        scoreRange = (scoreLimits[1] - scoreLimits[0])

        for args in sys.argv[2:]:
            # check if range of scores is specified -> if so recompute Range
            if args[:2] =='r=':
                scoreLimits = np.asarray([int(s) for s in args[2:].split(',')])
                scoreRange = (scoreLimits[1] - scoreLimits[0])

            # check if consensus percentage was specified
            elif args[:2]=='c=':
               consensusRangeInPercent = int(args[2:])

        radius = scoreRange * consensusRangeInPercent/200
        threshold = int(scoreRange/2)

        print 'using', scoreLimits[0], ' and ', scoreLimits[1], ' as min and max score'
        passingThreshold = int(scoreLimits[1]-scoreLimits[0]) / 2
        print 'using ', passingThreshold , ' as threshold (<= threshold -> fail)'
        print 'using', radius, ' as consensusRadius'
        print "scores: ", scores
        finalScore, agreeingAssessors = calculateResult(scores,radius, threshold, verbose=True)
        if len(agreeingAssessors) > len(scores)/2 :
            print "winningScores: ", scores[agreeingAssessors]
            print "finalScore: ", finalScore, "\nwinning Assessors: ",  agreeingAssessors
            # print "payouts(% of cost (without stake/burning)): ", getPayouts(scores, finalScore, 100, scores[agreeingAssessors])
        else:
            print "no consensus reached!!!"
    else:
        # ============== b) test clustering functions ===================
        print "testing the implemented functions..."
        testMAD()
        verbose = True
        testCalculateResults(radius, threshold, verbose=verbose)
main()



# ================= edge cases ========================
# here I enter tricky cases that might break the system. one assessor going crazy high.
# to see the effect on the score and the cluster
# edge = False

# # compare-flag: true -> runs both clusterSOL and cluster1
# # and prints the results next to each other
# verbose = True
# if edge:
#     print "Looking at edge cases..."
#     cases = [
#         # this one looks bad for clusterSOL and good for cluster1?
#         np.asarray([1, 1, 1, 1, 0, 1000]),
#         # this one will have many three winning clusters, each with 3 scores -> DRAW?
#         np.asarray([1, 2, 3, 4, 5]),
#         # how to deal with a draw
#         np.asarray([1, 1, 1, 2, 2, 2])

#     ]
#     for scores in cases:
#         print "===== ", scores, " =========="
#         finalScore, winnerAssessors = calculateResult(
#             scores, cluster1, MMD, verbose  # <change here betwen clusterSOL/1
#         )
#         print "winningScores: ", scores[winnerAssessors]
#         print "finalScore: ", finalScore
#         print "winning Assessors: ",  winnerAssessors


const ConceptRegistry = artifacts.require('ConceptRegistry')
const FathomToken = artifacts.require('FathomToken')
const Concept = artifacts.require('Concept')

let conReg
let aha
let mewAddress
let createdConceptAddress

contract('ConceptRegistry', function (accounts) {

  it('should have created the mew contract', async () => {
    conReg = await ConceptRegistry.deployed()
    mewAddress = await conReg.mewAddress.call()

    assert.isTrue(await conReg.conceptExists.call(mewAddress), "mew doesn't exist")
  })
  it('should be able to create a first concept from the MEW', async () => {
    let txReciept = await conReg.makeConcept([mewAddress], [500], 60 * 60 * 24, '', accounts[0])
    createdConceptAddress = txReciept.logs[0].args['_concept']

    let createdConcept = await Concept.at(createdConceptAddress)
    assert.isTrue(await conReg.conceptExists.call(createdConceptAddress), "concept1 doesn't exist")
  })
  it('should be able to create a second concept from the MEW with same data', async () => {
    let txRecieptS = await conReg.makeConcept([mewAddress], [500], 60 * 60 * 24, '', accounts[0])
    createdConceptAddressS = txRecieptS.logs[0].args['_concept']

    let createdConceptS = await Concept.at(createdConceptAddressS)
    assert.isTrue(await conReg.conceptExists.call(createdConceptAddressS), 'a new concept should have been created')
  })
  it("shouldn't be the same address for both concepts (same data)", async () => {
    console.log('createdConceptAddress : ' + createdConceptAddress)
    console.log('createdConceptAddressS : ' + createdConceptAddressS)

    assert.notEqual(createdConceptAddress, createdConceptAddressS, 'concept1 and concept1(same data) are the same')
  })
  it('should be able to create another concept from the MEW with different data', async () => {
    let txReciept2 = await conReg.makeConcept([mewAddress], [500], 60 * 60 * 24, 'okok', accounts[0])
    createdConceptAddress2 = txReciept2.logs[0].args['_concept']

    let createdConcept2 = await Concept.at(createdConceptAddress2)

    assert.isTrue(await conReg.conceptExists.call(createdConceptAddress2), "concept2 doesn't exist")
  })
  it("shouldn't be the same address for both concepts (different data)", async () => {
    console.log('createdConceptAddress : ' + createdConceptAddress)
    console.log('createdConceptAddress2 : ' + createdConceptAddress2)

    assert.notEqual(createdConceptAddress, createdConceptAddress2, 'concept1 and concept2 are the same')
  })
})

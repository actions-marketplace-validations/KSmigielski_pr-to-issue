import {findIssueNumber, buildNewDescription} from '../src/helpers'

import {expect, test} from '@jest/globals'

test('Should throw Error if message is empty', () => {
  expect(findIssueNumber('')).toBeUndefined()
})

test('Should throw Error if message does not contain issue', () => {
  expect(findIssueNumber('This is some message')).toBeUndefined()
})

test('Should return issue number when is from same repo', () => {
  expect(findIssueNumber('#1')).toEqual('#1')
})

test('Should return issue number when is at beginning', () => {
  expect(findIssueNumber('#2 number at begining')).toEqual('#2')
})

test('Should return issue number when is at the end', () => {
  expect(findIssueNumber('issue number at the end #3')).toEqual('#3')
})

test('Should return issue number when is in the middle', () => {
  expect(findIssueNumber('issue number #4 in middle')).toEqual('#4')
})

test('Should return issue number when is from external repo', () => {
  expect(findIssueNumber('organization-test/repo-test/#1')).toEqual(
    'organization-test/repo-test/#1'
  )
})

test('Should return only closing command if description is not present', () => {
  expect(buildNewDescription('#123', undefined)).toEqual('Resolve #123')
})

test('Should return only closing command if description is empty', () => {
  expect(buildNewDescription('org/repo/#123', '')).toEqual(
    'Resolve org/repo/#123'
  )
})

test('Should add closing command at the end of the description if it is not present already', () => {
  expect(buildNewDescription('#1', 'Some description')).toEqual(
    'Some description\r\n\r\nResolve #1'
  )
})

test('Should skip adding command at the end of the description if it is present already', () => {
  expect(buildNewDescription('#1', 'Some description \r\n Close #1')).toEqual(
    'Some description \r\n Close #1'
  )
})

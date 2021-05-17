const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Department', () => {
  it('should throw an error if no "name" arg', () => {
    const dep = new Department({});

    dep.validate(err => {
      expect(err.errors.name).to.exist;
    });
  });

  it('should throw an error if "name" is not a string', () => {
    const cases = [{}, []];
    for(let name of cases) {
      const dep = new Department({ name });
      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should check if "name" has proper length', () => {
    names = ['gfgf', 'abcabcabcabcabcabcabcabcabc'];
    for(let name of names) {
      const dep = new Department({ name });
      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should throw no errors when pass proper "name"', () => {
    const names = ['firstName', 'secondName', 'thirdName'];
    for(let name of names) {
      const dep = new Department({ name });
      dep.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });
  
  after(() => {
    mongoose.models = {};
  });
});
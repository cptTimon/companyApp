const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');


describe('Employee', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
  
      const uri = await fakeDB.getUri();
  
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    } catch(err) {
      console.log(err);
    }
  });
  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmpOne.save();

      const testDep = new Department({ name: 'ITDepartment'})
      testDep.save();

      const testEmpTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmpTwo.save();

      const testEmpThree = new Employee({ firstName: 'FirstName #3', lastName: 'LastName #3', department: testDep._id });
      await testEmpThree.save();
      
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 3;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "firstName", "lastName" or "department" with findOne method', async () =>{
      const employeeByFirstName = await Employee.findOne({ firstName: 'FirstName #1' });
      const employeeByLastName = await Employee.findOne({ lastName: 'LastName #1' });
      const employeeByDepartment = await Employee.findOne({ department: 'Department #2' });
      expect(employeeByFirstName.firstName).to.be.equal('FirstName #1');
      expect(employeeByLastName.lastName).to.be.equal('LastName #1');
      expect(employeeByDepartment.department).to.be.equal('Department #2');
    });
    
    it('should return object with data when using "populate" method on "department" attribute', async () => {
      const employee = await Employee.findOne({ firstName: 'FirstName #3' }).populate('department');
      expect(employee.department.name).to.be.equal('ITDepartment');
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    
    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
    
    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'FirstName #1' }, { $set: { firstName: 'NewFirstName' } });
      const updatedEmployee = await Employee.findOne({ firstName: 'NewFirstName' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => { 
      const employee = await Employee.findOne({ lastName: 'LastName #2' });
      employee.lastName = 'NewLastName';
      await employee.save();

      const updatedEmployee = await Employee.findOne({ lastName: 'NewLastName' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { department: 'New Department' } });
      const employees = await Employee.find();
      expect(employees[0].department).to.be.equal('New Department');
      expect(employees[1].department).to.be.equal('New Department');
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'FirstName #1' });
      const deletedEmployee = await Employee.findOne({ firstName: 'FirstName #1' });
      expect(deletedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ lastName: 'LastName #2' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ lastName: 'LastName #2' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany({});
      const removedEmployees = await Employee.find();
      expect(removedEmployees.length).to.be.equal(0);
    });
  });
});
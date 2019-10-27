'use strict';
module.exports = (sequelize, DataTypes) => {
  const Association = sequelize.define('Association', {
    teacherEmail: DataTypes.STRING,
    StudentEmail: DataTypes.STRING,
    StudentName: DataTypes.STRING
  }, {});
  Association.associate = function(models) {
    // associations can be defined here
  };
  return Association;
};
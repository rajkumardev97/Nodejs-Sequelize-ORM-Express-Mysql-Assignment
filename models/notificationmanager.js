'use strict';
module.exports = (sequelize, DataTypes) => {
  const NotificationManager = sequelize.define('NotificationManager', {
    teacherEmail: DataTypes.STRING,
    StudentEmail: DataTypes.STRING,
    Notification: DataTypes.STRING
  }, {});
  NotificationManager.associate = function(models) {
    // associations can be defined here
  };
  return NotificationManager;
};
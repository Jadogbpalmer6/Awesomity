module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("employe", {
    id: {
      type: Sequelize.INTEGER, 
      autoIncrement : true,
      unique : true,
      primaryKey: true
    },
    Name: {
      type: Sequelize.STRING
    },
    National_id: {
      type: Sequelize.STRING,
      unique: true
    },
    Code: {
      type: Sequelize.STRING,
      unique: true
    },
    Phone_number : {
      type: Sequelize.INTEGER,
      unique: true
    },
    Email : {
      type: Sequelize.STRING,
      unique: true
    },Password : {
      type: Sequelize.STRING
    },
    Date_of_birth : {
      type: Sequelize.DATE
    },
    Status : {
      type: Sequelize.STRING
    },
    Position : {
      type: Sequelize.STRING
    },
    Phone_number : {
      type: Sequelize.INTEGER
    },
    Create_date : {
      type: Sequelize.DATE, defaultValue: Sequelize.NOW
    }
  },{
    timestamps: false
  });

  return Tutorial;
};

// models/Invoice.js

module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Paid', 'Pending'),
        defaultValue: 'Pending',
      },
      dateIssued: {
        type: DataTypes.DATEONLY,
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    });
  
    Invoice.associate = (models) => {
      Invoice.belongsTo(models.Client, { foreignKey: 'clientId' });
    };
  
    return Invoice;
  };
  
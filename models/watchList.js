module.exports = function (sequelize, DataTypes) {
    const listInfo = sequelize.define('watchList', {
        movieImage: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isWatched: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        owner: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return listInfo
}
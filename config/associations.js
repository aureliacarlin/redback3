const sequelize = require('../db');
require('../models/user')
require('../models/watchList')

const User = sequelize.model('user');
const WatchList = sequelize.model('watchList');

User.hasMany(WatchList)
WatchList.belongsTo(User)

sequelize.sync();
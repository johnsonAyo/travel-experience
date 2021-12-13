"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const passport = require('passport');
;
const exphbs = require("express-handlebars");
const db_1 = require("./config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_2 = __importDefault(require("morgan"));
const session = require('express-session');
const app = (0, express_1.default)();
const index_1 = __importDefault(require("./routes/index"));
const auth_1 = __importDefault(require("./routes/auth"));
const travels_1 = __importDefault(require("./routes/travels"));
const MongoStore = require('connect-mongo')(session);
dotenv_1.default.config({ path: './config.env' });
require('./config/passport')(passport);
// view engine setup
app.set('view engine', 'hbs');
app.set('views', path_1.default.join(__dirname, '/../views'));
app.use((0, cors_1.default)({
    origin: [
        'https://customer-care10.herokuapp.com/',
        'http://localhost:5001/',
    ],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}));
// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select, } = require('./helpers/hbs');
// Handlebars
app.engine('.hbs', exphbs.engine({
    helpers: {
        editIcon,
        formatDate,
        stripTags,
        truncate,
        select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path_1.default.join(__dirname, '/../views/layouts')
}));
app.set('view engine', 'hbs');
// sesssion middleware
//passport middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '/../public')));
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: db_1.mongoose.connection }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});
app.use("/", index_1.default);
app.use("/auth", auth_1.default);
app.use("/travels", travels_1.default);
app.use((0, morgan_1.default)('dev'));
app.use((0, morgan_2.default)('dev'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.send(err);
});
const PORT = process.env.PORT || 4000;
(0, db_1.connect)();
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
exports.default = app;

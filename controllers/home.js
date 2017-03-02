/**
 * GET /
 * Home page.
 */
exports.index = function (req, res) {

    res.redirect('/app.html');
    // res.render('home', {
    //   title: 'Home'
    // });
};

exports.landing = function (req, res) {

    res.render('landing', {
        "title": 'Redirect',
        "id": req.query.id ? req.query.id : ""
    });
};
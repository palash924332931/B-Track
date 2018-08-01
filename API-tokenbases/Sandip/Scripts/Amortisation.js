var Amortisation = new function () {
    var that = this;

    var amt = 800000;
    var R = 6;
    var Tenure = 60;

    var PBOM = 0;
    var PEOM = 0;
    var d = 30;
    var rental = 15470;

    this.Interstcal = function (PBOM) {

        return (R * PBOM * d) / (100 * 365);
    };

    var A = [];

    for (var i = 1; i <= Tenure; i++) {
        var interest = 0;
        if (i == 1) {
            PBOM = amt;
            interest = that.Interstcal(PBOM);
        }
        else {
            PBOM = PEOM;
            interest = that.Interstcal(PBOM);
        }

        var Principal = rental - interest;
        PEOM = PBOM - Principal;
        
        var model = {};
        //model.Date = ;
        model.PBOM = PBOM;
        model.interest = interest;
        model.Principal = Principal;
        model.rental = rental;
        model.PEOM = PEOM;

        A.push(model);
        console.log(A);

        //alert(PBOM + 'pb  ' + interest + 'inst  ' + Principal + 'prncpl   ' + rental + 'rentl   ' + PEOM + 'eom');
    }
};



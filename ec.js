function stringer(value, length) {
    value = '' + value;
    return '000000'.substring(0, length - value.length) + value;
}

function dateStruct(calendar, year, month, day) {
    this._calendar = calendar;
    this._year = year;
    this._month = month;
    this._day = day;
    return {
        _calendar: this._calendar,
        _year: this._year,
        _month: this._month,
        _day: this._day,
        newDate: function (year, month, day) {
            return this._calendar.newDate((typeof year === 'undefined' || year === null ? this : year), month, day);
        },
        year: function (year) {
            return (arguments.length === 0 ? this._year : this.set(year, 'y'));
        },
        month: function (month) {
            return (arguments.length === 0 ? this._month : this.set(month, 'm'));
        },
        day: function (day) {
            return (arguments.length === 0 ? this._day : this.set(day, 'd'));
        },
        date: function (year, month, day) {
            this._year = year;
            this._month = month;
            this._day = day;
            return this;
        },
        set: function (value, period) {
            return this._calendar.set(this, value, period);
        },
        leapYear: function () {
            return this._calendar.leapYear(this);
        },
        calendar: function () {
            return this._calendar;
        },
        toJD: function () {
            return this._calendar.toJD(this);
        },
        fromJD: function (jd) {
            return this._calendar.fromJD(jd);
        },
        toJSDate: function () {
            return this._calendar.toJSDate(this);
        },
        toEC: function () {
            return this._calendar.toEC(this);
        },
        toGC: function () {
            return this._calendar.toGC(this);
        },
        fromJSDate: function (jsd) {
            return this._calendar.fromJSDate(jsd);
        },
        toString: function (sep) {
            sep = sep || '-';
            return (this.year() < 0 ? sep : '') + stringer(Math.abs(this.year()), 4) +
                sep + stringer(this.month(), 2) + sep + stringer(this.day(), 2);
        }
    }
}

function Calendar() {

    this.regionalOptions = [];
    this.regionalOptions[''] = {
        invalidCalendar: 'Calendar {0} not found',
        invalidDate: 'Invalid {0} date',
        invalidMonth: 'Invalid {0} month',
        invalidYear: 'Invalid {0} year',
        differentCalendars: 'Cannot mix {0} and {1} dates'
    };
    this.local = this.regionalOptions[''];
    this.calendars = {};
    this._localCals = {};
    return {
        dateStruct: dateStruct,
        local: this.local,
        regionalOptions: {
            '': this.regionalOptions['']
        },
        calendars: this.calendars,
        _localCals: this._localCals,
        instance: function (name, language) {
            name = (name || 'gregorian').toLowerCase();
            language = language || '';
            var cal = this._localCals[name + '-' + language];
            if (!cal && this.calendars[name]) {
                cal = new this.calendars[name](language);
                this._localCals[name + '-' + language] = cal;
            }
            if (!cal) {
                throw (this.local.invalidCalendar || EC.regionalOptions[''].invalidCalendar).
                    replace(/\{0\}/, name);
            }

            return cal;
        },

        newDate: function (year, month, day, calendar, language) {
            calendar = ((typeof year !== 'undefined' && year !== null) && year.year ? year.calendar() :
                (typeof calendar === 'string' ? this.instance(calendar, language) : calendar)) || this.instance();
            return calendar.newDate(year, month, day, calendar);
        }
    }
}

var EC = new Calendar();

function EthiopianCalendar(language) {
    this.local = EC.regionalOptions[language || ''] || EC.regionalOptions[''];
    return {
        name: 'Ethiopian',
        jdEpoch: 1724220.5,
        daysPerMonth: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5],
        hasYearZero: false,
        minMonth: 1,
        firstMonth: 1,
        minDay: 1,
        regionalOptions: {
            '': {
                name: 'Ethiopian',
                epochs: ['BEE', 'EE'],
                monthNames: ['Meskerem', 'Tikemet', 'Hidar', 'Tahesas', 'Tir', 'Yekatit',
                    'Megabit', 'Miazia', 'Genbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'],
                monthNamesShort: ['Mes', 'Tik', 'Hid', 'Tah', 'Tir', 'Yek',
                    'Meg', 'Mia', 'Gen', 'Sen', 'Ham', 'Neh', 'Pag'],
                dayNames: ['Ehud', 'Segno', 'Maksegno', 'Irob', 'Hamus', 'Arb', 'Kidame'],
                dayNamesShort: ['Ehu', 'Seg', 'Mak', 'Iro', 'Ham', 'Arb', 'Kid'],
                dayNamesMin: ['Eh', 'Se', 'Ma', 'Ir', 'Ha', 'Ar', 'Ki'],
                digits: null,
                dateFormat: 'dd/mm/yyyy',
                firstDay: 0,
                isRTL: false
            }
        },
        newDate: function (year, month, day) {
            if (typeof year === 'undefined' || year === null) {
                return this.today();
            }
            if (year.year) {
                day = year.day();
                month = year.month();
                year = year.year();
            }
            return new dateStruct(this, year, month, day);
        },
        today: function () {
            return this.fromJSDate(new Date());
        },
        fromJSDate: function (jsd) {
            return this.fromJD(EC.instance().fromJSDate(jsd).toJD());
        },
        set: function (date, value, period) {
            var y = (period === 'y' ? value : date.year());
            var m = (period === 'm' ? value : date.month());
            var d = (period === 'd' ? value : date.day());
            if (period === 'y' || period === 'm') {
                d = Math.min(d, this.daysInMonth(y, m));
            }
            return date.date(y, m, d);
        },
        leapYear: function (year) {
            var date = this.newDate(year, this.minMonth, this.minDay)
            year = date.year() + (date.year() < 0 ? 1 : 0); // No year zero
            return year % 4 === 3 || year % 4 === -1;
        },
        toJD: function (year, month, day) {
            var date = this.newDate(year, month, day)
            year = date.year();
            if (year < 0) { year++; } // No year zero
            return date.day() + (date.month() - 1) * 30 +
                (year - 1) * 365 + Math.floor(year / 4) + this.jdEpoch - 1;
        },
        fromJD: function (jd) {
            var c = Math.floor(jd) + 0.5 - this.jdEpoch;
            var year = Math.floor((c - Math.floor((c + 366) / 1461)) / 365) + 1;
            if (year <= 0) { year--; } // No year zero
            c = Math.floor(jd) + 0.5 - this.newDate(year, 1, 1).toJD();
            var month = Math.floor(c / 30) + 1;
            var day = c - (month - 1) * 30 + 1;
            return this.newDate(year, month, day);
        },
        toGC: function (et) {
            return EC.instance('gregorian').fromJD(et.toJD())
        }
    }
}

function GregorianCalendar(language) {
    this.local = EC.regionalOptions[language] || EC.regionalOptions[''];
    return {
        name: 'Gregorian',
        jdEpoch: 1721425.5,
        daysPerMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        hasYearZero: false,
        minMonth: 1,
        firstMonth: 1,
        minDay: 1,
        regionalOptions: {
            '': {
                name: 'Gregorian',
                epochs: ['BCE', 'CE'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'],
                monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                digits: null,
                dateFormat: 'mm/dd/yyyy',
                firstDay: 0,
                isRTL: false
            }
        },
        newDate: function (year, month, day) {
            if (typeof year === 'undefined' || year === null) {
                return this.today();
            }
            if (year.year) {
                day = year.day();
                month = year.month();
                year = year.year();
            }
            return new dateStruct(this, year, month, day);
        },
        today: function () {
            return this.fromJSDate(new Date());
        },
        set: function (date, value, period) {
            var y = (period === 'y' ? value : date.year());
            var m = (period === 'm' ? value : date.month());
            var d = (period === 'd' ? value : date.day());
            if (period === 'y' || period === 'm') {
                d = Math.min(d, this.daysInMonth(y, m));
            }
            return date.date(y, m, d);
        },
        leapYear: function (year) {
            var date = this.newDate(year, this.minMonth, this.minDay)
            year = date.year() + (date.year() < 0 ? 1 : 0); // No year zero
            return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        },
        toJD: function (year, month, day) {
            var date = this.newDate(year, month, day)
            year = date.year();
            month = date.month();
            day = date.day();
            if (year < 0) { year++; }
            if (month < 3) {
                month += 12;
                year--;
            }
            var a = Math.floor(year / 100);
            var b = 2 - a + Math.floor(a / 4);
            return Math.floor(365.25 * (year + 4716)) +
                Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
        },
        fromJD: function (jd) {
            var z = Math.floor(jd + 0.5);
            var a = Math.floor((z - 1867216.25) / 36524.25);
            a = z + 1 + a - Math.floor(a / 4);
            var b = a + 1524;
            var c = Math.floor((b - 122.1) / 365.25);
            var d = Math.floor(365.25 * c);
            var e = Math.floor((b - d) / 30.6001);
            var day = b - d - Math.floor(e * 30.6001);
            var month = e - (e > 13.5 ? 13 : 1);
            var year = c - (month > 2.5 ? 4716 : 4715);
            if (year <= 0) { year--; } // No year zero
            return this.newDate(year, month, day);
        },
        toJSDate: function (year, month, day) {
            var date = this.newDate(year, month, day)
            var jsd = new Date(date.year(), date.month() - 1, date.day());
            jsd.setHours(0);
            jsd.setMinutes(0);
            jsd.setSeconds(0);
            jsd.setMilliseconds(0);
            jsd.setHours(jsd.getHours() > 12 ? jsd.getHours() + 2 : 0);
            return jsd;
        },
        fromJSDate: function (jsd) {
            return this.newDate(jsd.getFullYear(), jsd.getMonth() + 1, jsd.getDate());
        },
        toEC: function (gc) {
            return EC.instance('ethiopian').fromJD(gc.toJD())
        }
    }
}

EC.calendars.gregorian = GregorianCalendar;

EC.calendars.ethiopian = EthiopianCalendar

if (typeof exports !== 'undefined') {
    module.exports = EC
}

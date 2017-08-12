# EC.JS
#### For Development Purpose (only 20 % done)

***EC.Js*** (Ethiopian calendar- የኢትዮጲያ የቀን መቁጠሪያ) aims to implement  [Ethiopian Calendar](https://en.wikipedia.org/wiki/Ethiopian_calendar) conversion plus more other functionalities


### Installation

```
 <script src="ec.js"></script>

```



### Features 

- [x] `toEC` Date conversion from Gregorian to Ethiopian
- [x] `toGC` Date conversion from Ethiopian to Gregorian
- [x] `leapYear` Determine whether or not this date is in a leap year
- [ ] `formatYear` Retrieve the formatted year for this date
- [ ] `weekOfYear` Retrieve the number of the week within the year in which this date is located
- [ ] `daysInYear` Retrieve the number of days in this date's year.
- [ ] `dayOfYear` Retrieve this date's position within the year
- [ ] `daysInMonth` Retrieve the number of days in this date's month
- [ ] `dayOfWeek` Determine this date's day of the week
- [ ] `weekDay` Determine whether or not this date is a normal week day
- [ ] `add` Add a number of periods to this date
- [x] `set` Set a period for this date
- [ ] `compareTo` Compare this date to another date
- [ ] `toJD` Retrieve the Julian date for this date
- [ ] `fromJD` Create a new date for a given Julian date.
- [x] `toJSDate` Convert this date into the equivalent JavaScript Date
- [x] `toString` Retrieve a string representation of this date
- [ ] Accepts new calendar type (Siltie, Oromo, Sidama and Borena) as a plugin
- [ ] Localisation option for each calendar

###### - You can also suggest more features on the issue section
###### - Make a PR to contribute


### Usage


##### Get instance

```javascript
// Ethiopian calendar instance
var et = EC.instance('ethiopian');
// Gregorian calendar instance
var gc = EC.instance()

```

*note:  date validation does not work yet*

##### today()

```javascript

//get today Date in EC 2009-10-21
et.today().toString()

//get today Date in EC 2009/10/21
et.today().toString('/') 

// get today Date in JS Date format
gc.today().toJSDate();

// get today Date in string format
gc.today().toString();

```


##### fromJSDate()

```javascript

//get EC for JS Date
et.fromJSDate(new Date()).toString()

//get EC for JS Date -new Date("2017-10-20") ->  2010-02-10
et.fromJSDate(new Date("2017-10-20")).toString()

// get GC from sample JS Date and convert to JS format
// toJSDate only works for GC dates
gc.fromJSDate(new Date("2017-10-20")).toJSDate())

```

##### toEC()

```javascript

//get current date in GC and convert it to EC in string format

gc.today().toEC().toString();

// get GC for sample JS Date and convert it to EC in string Format
gc.fromJSDate(new Date("2017-10-20")).toEC().toString()


```

##### toGC()

```javascript

// convert today from EC to GC and get the result in JS Date
et.today().toGC().toJSDate()

//convert today from EC to GC and get the result in string with default separator
et.today().toGC().toString()

```


##### leapYear()

```javascript

// check if the EC date is leap year or not
et.today().leapYear() // true or false

//check if the GC date is leap year or not
gc.today().leapYear() // true or false

```


##### set()

```javascript

// set current date to 30 and return string format
et.today().day(30).toString()

// set current month to 5 and return string format
et.today().month(5).toString()

// set current year to 2011 and return string format
et.today().year(2011).toString()

// set current date to 30 and return string format
gc.today().day(30).toString()

// set current month to 5 and return string format
gc.today().month(5).toString()

// set current year to 2011 and return string format
gc.today().year(2018).toString()

```


### Implementation Points

- Leap years occur every four years on the third year of a cycle.
- Each year has 12 months of 30 days and an intercalary month of 5 or 6 days, making 365 or 366 days in total.
- The first day of the week is Ehud - እሁድ (Sunday).


### Resources

- [Ethiopian Calendar wikipedia](https://en.wikipedia.org/wiki/Ethiopian_calendar)
- [Drs. Berhanu Beyene and Manfred Kudlek Geez Calendars](http://www.geez.org/Calendars/)




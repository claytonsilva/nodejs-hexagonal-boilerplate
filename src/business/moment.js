import * as R from 'ramda'
import { momentConfig } from '../config'
import * as _moment from 'moment-timezone'

/**
 * @description Moment with timezone local
 * @memberof business
 * @function
 * @param  {string} timezone (optional) overload default timezone if necessary
 * @returns {_moment.Moment} moment with timezone configure
 */
const moment = (timezone) => {
  return _moment.tz(timezone || momentConfig.timezone)
}

/**
 * @description Get the current time formated with 'YYYYMMDDHHmm'
 * @memberof business
 * @function
 * @param {Moment} dta instantiate moment object
 * @returns {string} Protocol prefix.
 */
const getDateFormated = (dta) => {
  return dta.format('YYYYMMDDHHmm')
}

/**
 * @description Moment with timezone local in iso8601
 * @memberof business
 * @function
 * @param  {_moment.Moment} dta (optional) moment instance for overload "new moment()" if necessary
 * @param  {string} timezone (optional) overload default timezone if necessary
 * @returns {string} iso8601 string datetime with timezone defined
 */
const toISOString = (dta, timezone) => {
  return (R.isNil(dta) || _moment.tz(timezone || momentConfig.timezone)).toISOString(true)
}

/**
 * Centralizando as configurações do moment
 */
export { moment, toISOString, getDateFormated }

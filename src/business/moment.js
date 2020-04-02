import R from 'ramda'
import { momentConfig } from '../config'
import moment from 'moment'
import 'moment-timezone'

/**
 * @description Moment with timezone local
 * @memberof business
 * @function
 * @param  {moment.MomentInput} dta (optional) override dta if necessary
 * @param  {string} timezone (optional) overload default timezone if necessary
 * @returns {moment.Moment} moment with timezone configure
 */
const momentWithTz = (dta, timezone = momentConfig.timezone) => {
  return (R.isNil(dta) ? moment() : moment(dta)).tz(timezone)
}

/**
 * @description Get the current time formated with 'YYYYMMDDHHmm'
 * @memberof business
 * @function
 * @param  {moment.Moment} dta instantiate moment object
 * @returns {string} Protocol prefix.
 */
const getDateFormated = (dta) => {
  return dta.format('YYYYMMDDHHmm')
}

/**
 * @description Moment with timezone local in iso8601
 * @memberof business
 * @function
 * @param  {moment.Moment} dta (optional) moment instance for overload "new moment()" if necessary
 * @param  {string} timezone (optional) overload default timezone if necessary
 * @returns {string} iso8601 string datetime with timezone defined
 */
const toISOString = (dta, timezone = momentConfig.timezone) => {
  return (R.isNil(dta) ? momentWithTz(null, timezone) : dta).toISOString(true)
}

/**
 * Centralizando as configurações do moment
 */
export { momentWithTz, toISOString, getDateFormated }

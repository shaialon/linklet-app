import React, { Component } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

import ContainerPage from '../hocs/ContainerPage'
import PublicPage from '../hocs/PublicPage'

import mobileJs from 'ismobilejs'
import addDays from 'date-fns/add_days'
import startOfWeek from 'date-fns/start_of_week'
import lastDayOfWeek from 'date-fns/last_day_of_week'
import addWeeks from 'date-fns/add_weeks'
import startOfMonth from 'date-fns/start_of_month'
import lastDayOfMonth from 'date-fns/last_day_of_month'

import db from '../lib/db'
import SideBar from '../components/Sidebar'
import LinksList from '../components/LinksList'

class Item extends Component {
  static async getInitialProps ({ query, req }) {
    const { itemId } = query
    console.log(query)

    const today = new Date()
    const yesterday = addDays(today, -1)
    const last7thDay = addDays(today, -7)
    const thisWeekStartDay = startOfWeek(today)
    const thisWeekLastDay = lastDayOfWeek(today)
    const lastWeekStartDay = startOfWeek(addWeeks(today, -1))
    const lastWeekLastDay = lastDayOfWeek(addWeeks(today, -1))
    const last30thDay = addDays(today, -31)
    const thisMonthStartDay = startOfMonth(today)
    const lastMonthStartDay = startOfMonth(last30thDay)
    const lastMonthEndDay = lastDayOfMonth(last30thDay)

    const filterOptions = {
      today,
      yesterday,
      last7thDay,
      thisWeekStartDay,
      thisWeekLastDay,
      lastWeekStartDay,
      lastWeekLastDay,
      last30thDay,
      thisMonthStartDay,
      lastMonthStartDay,
      lastMonthEndDay
    }
    let res
    try {
      console.log(query)
      // var stack = new Error().stack
      // console.log( stack );
      console.trace()
      res = await db.getById({ itemId: itemId || 250 })
    } catch (e) {
      throw e
    }
    const isMobile = req
      ? mobileJs(req.headers['user-agent']).any
      : mobileJs.any

    // console.dir(res, {colors: true, depth: null});

    return { item: res, filterOptions, isMobile }
  }
  constructor (props) {
    super(props)
    this.state = {
      toggleFilter: false
    }
  }
  toggleFilter (e) {
    e && e.preventDefault()
    this.setState({
      toggleFilter: !this.state.toggleFilter
    })
  }
  render () {
    const { item, filterOptions, url, user, isMobile } = this.props
    return (
      <div className='home'>
        <Header
          user={this.props.user}
          url={url}
          about
          title='Linklet | Home'
          toggleFilter={this.toggleFilter.bind(this)}
        />
        <SideBar
          url={url}
          filterOptions={filterOptions}
          toggleFilter={this.toggleFilter.bind(this)}
          filterOpenState={this.state.toggleFilter}
        />
        <main>
          <div className='list'>
            <h1>{item.name}</h1>
            <img src={item.image} />
          </div>
        </main>

        <Footer />
        <style jsx>
          {`
            .home {
              min-height: 100%;
              width: 100%;
            }
            input[type='date'] {
              border: none;
              width: 100%;
              font-size: 20px;
              border-bottom: 2px solid #888;
              margin-top: 10px;
              -webkit-appearance: none;
            }
            button {
              cursor: pointer;
              float: right;
              background: teal;
              border: none;
              outline: none;
              padding: 10px 20px;
              box-shadow: 0 0 5px #888;
              border-radius: 4px;
              color: #fff;

              font-size: 18px;
            }
            button:hover {
              background: green;
            }
            main {
              padding: 30px 0;
              padding-top: 100px;
              margin-left: 200px;
            }
            .list {
              list-style-type: none;
              margin: 0 20px;
              padding: 0;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              min-height: 250px;
            }
            .pagination {
              display: flex;
              justify-content: center;
            }
            @media (max-width: 1020px) {
              main {
                margin: 0;
                padding-top: 56px;
              }
              .list {
                margin: 0;
              }
            }
            @media (max-width: 720px) {
              .list {
                margin-top: 10px;
              }
            }
            @media (max-width: 520px) {
              .info span {
                flex-wrap: wrap;
              }
              .filterDetails {
                margin-top: 10px;
              }
            }
          `}
        </style>
      </div>
    )
  }
}

export default ContainerPage(PublicPage(Item))

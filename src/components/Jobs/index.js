import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FilterGroup from '../FilterGroup'
import ProfileCard from '../ProfileCard'
import JobItem from '../JobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const initialState = {
  searchInput: '',
  employmentType: '',
  minimumPackage: '',
}

class Jobs extends Component {
  state = {
    ...initialState,
    jobsList: [],
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/profile`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        profileImageUrl: data.profile_details.profile_image_url,
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getModifiedJobsListData = jobsList =>
    jobsList.map(eachJob => ({
      companyLogoUrl: eachJob.company_logo_url,
      id: eachJob.id,
      employmentType: eachJob.employment_type,
      jobDescription: eachJob.job_description,
      location: eachJob.location,
      packagePerAnnum: eachJob.package_per_annum,
      rating: eachJob.rating,
      title: eachJob.title,
    }))

  getJobsList = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, employmentType, minimumPackage} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const {jobs} = await response.json()

    if (response.ok === true) {
      const updatedData = this.getModifiedJobsListData(jobs)
      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeInput = event => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  renderSearchBar = () => {
    const {searchInput} = this.state

    return (
      <div className="searchbar-container">
        <input
          type="search"
          name="searchInput"
          value={searchInput}
          onChange={this.onChangeInput}
          placeholder="Search"
        />
        <div className="search-icon-container">
          <button
            type="button"
            data-testid="searchButton"
            onClick={this.getJobsList}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
      </div>
    )
  }

  renderJobItemsList = () => {
    const {jobsList} = this.state

    return (
      <ul className="jobs-list-items-container">
        {jobsList.map(eachJob => (
          <JobItem jobDetails={eachJob} key={eachJob.id} />
        ))}
      </ul>
    )
  }

  renderLodingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot sæm to find the page you are looking for.</p>
      <button type="button" className="retry-button" onClick={this.getJobsList}>
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs-view-container jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters.</p>
    </div>
  )

  renderJobsRouteViews = () => {
    const {jobsApiStatus, jobsList} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        if (jobsList.length === 0) return this.renderNoJobsView()
        return this.renderJobItemsList()
      case apiStatusConstants.inProgress:
        return this.renderLodingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {profileDetails, profileApiStatus} = this.state

    return (
      <div className="route-bg-container">
        <Header />
        <div className="job-route-container">
          <div className="profile-filter-group-container">
            <ProfileCard
              profileDetails={profileDetails}
              profileApiStatus={profileApiStatus}
              getProfileDetails={this.getProfileDetails}
            />
            <FilterGroup />
          </div>
          <div className="search-job-items-container">
            {this.renderSearchBar()}
            {this.renderJobsRouteViews()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs

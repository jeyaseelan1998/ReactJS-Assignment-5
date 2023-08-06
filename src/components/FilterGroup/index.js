import {Component} from 'react'
import './index.css'

const FilterGroup = props => {
  const renderEmploymentTypes = () => {
    const {updateEmploymentType, employmentTypesList} = props
    return (
      <ul className="employment-type-list-container">
        {employmentTypesList.map(eachType => (
          <li key={eachType.employmentTypeId}>
            <input
              type="checkbox"
              id={eachType.employmentTypeId}
              name={eachType.employmentTypeId}
              onChange={updateEmploymentType}
            />
            <label htmlFor={eachType.employmentTypeId}>{eachType.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  const renderSalaryRanges = () => {
    const {salaryRangesList, updateMinimumPackage} = props

    return (
      <ul className="employment-type-list-container">
        {salaryRangesList.map(eachType => (
          <li key={eachType.salaryRangeId}>
            <input
              type="radio"
              id={eachType.salaryRangeId}
              value={eachType.salaryRangeId}
              name="minimumPackage"
              onChange={updateMinimumPackage}
            />
            <label htmlFor={eachType.salaryRangeId}>{eachType.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="filter-group-container">
      <h1>Type of Employment</h1>
      {renderEmploymentTypes()}
      <hr className="separator" />
      <h1>Salary Range</h1>
      {renderSalaryRanges()}
    </div>
  )
}

export default FilterGroup

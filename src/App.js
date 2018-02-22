import React, { Component } from 'react'
import './App.css'
import swal from 'sweetalert'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: '',
      rate: '',
      date: '',
      description: '',
      editing: false,
      data: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.deleteRecord = this.deleteRecord.bind(this)
    this.editRecord = this.editRecord.bind(this)
    this.confirmDeletion = this.confirmDeletion.bind(this)
    this.confirmEditing = this.confirmEditing.bind(this)
    this.clearFormData = this.clearFormData.bind(this)
    this.totalValue = this.totalValue.bind(this)
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    if (this.state.editing) {
      this.confirmEditing(this.editRecord, this.state.index, this.clearFormData)
      return null
    }
    this.state.data.push(this.state)
    this.setState({data: this.state.data})
    this.clearFormData()
  }

  confirmDeletion (callback, index) {
    swal({
      title: 'Are you sure?',
      text: 'Would you like to delete this document?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      closeModal: false
    })
    .then((deletionConfirmed) => {
      if (deletionConfirmed) {
        callback(index)
        swal("Poof! Your input has been deleted!", {
          icon: "success",
        });
      } else {
        swal('Your input was not deleted.', {
          icon: "error",
        });
      }
    })
  }

  confirmEditing (callback, index, clearData) {
    swal({
      title: 'Are you sure?',
      text: 'Would you like to edit this document?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      closeModal: false
    })
    .then((editingConfirmed) => {
      if (editingConfirmed) {
        callback(index)
        this.setState({editing: false})
        clearData()
        swal("Your input has been edited!", {
          icon: "success",
        });
      } else {
        this.setState({editing: false})
        swal('Your input was not edited.', {
          icon: "error",
        });
      }
    })
  }

  clearFormData () {
    this.setState({
      type: '',
      rate: '',
      date: '',
      description: '',
    })
  }

  deleteRecord (index) {
    let temp = this.state.data
    this.setState({ data: temp.filter((newInfo, i) =>
      (i !== index)
     )})
  }

  editRecord (index) {
    let temp = this.state.data
    this.setState({
      data: temp.map((oldInfo, pos) => {
        if (pos === index) {
          return this.state
        }
        return oldInfo
      })
    })
  }

  totalValue () {
    let sum = 0
    this.state.data.forEach((info) => {
      if (info.type === 'Saving') {
        sum += parseInt(info.rate, 10) // Convert value to integers with ParseInt because value is read in strings. Otherwise sum will concatenate all values together
      } else {
        sum -= parseInt(info.rate, 10)
      }
    })
    return sum
  }

  render () {
    return <div>
      <h1 style={{fontSize: '40px'}}>Personal Finance Manager</h1>

      {!this.state.editing ?
        <form className='report' onSubmit={this.handleSubmit}>
          <div className='col-left'>
            <label>
            Type
            <select name='type' value={this.state.type} onChange={this.handleChange} id='type'>
              <option value=''>Please select type</option>
              <option value='Saving'>Saving</option>
              <option value='Spending'>Spending</option>
            </select>
            </label>

            <label>
            Value
            <input type='number' value={this.state.rate} onChange={this.handleChange} name='rate' id='rate' min='0' />
            </label>

            <label>
            Date
            <input type='date' value={this.state.date} onChange={this.handleChange} name='date' id='date' />
            </label>
          </div>

          <div className='col-right'>
            <label>
            Description
            <textarea name='description' value={this.state.description} onChange={this.handleChange} id='description' cols='30' rows='11.5' />
            </label>
            <button type='submit'>Save</button>
          </div>
        </form> :

        <form className='report' onSubmit={this.handleSubmit}>
          <div className='col-left'>
            <label>
            Type
            <select name='type' value={this.state.type} onChange={this.handleChange} id='type'>
              <option value=''>Please select type</option>
              <option value='Saving'>Saving</option>
              <option value='Spending'>Spending</option>
            </select>
            </label>

            <label>
            Value
            <input type='number' value={this.state.rate} onChange={this.handleChange} name='rate' id='rate' min='0' />
            </label>

            <label>
            Date
            <input type='date' value={this.state.date} onChange={this.handleChange} name='date' id='date' />
            </label>
          </div>

          <div className='col-right'>
            <label>
            Description
            <textarea name='description' value={this.state.description} onChange={this.handleChange} id='description' cols='30' rows='11.5' />
            </label>
            <button type='submit'>Save</button>
          </div>
        </form>
      }

      <br />

      {this.state.data[0] ?
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Value</th>
              <th>Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td colspan='7'>Balance ($): {this.totalValue()}</td>
            </tr>
          </tfoot>
          <tbody>
            { this.state.data.map((info, index) =>
              <tr
                key={index}
              >
                <td>{info.type}</td>
                <td>{info.description}</td>
                <td>{info.rate}</td>
                <td>{info.date}</td>
                <td><button onClick={() => {
                    this.setState({ editing: true,
                      index})
                    this.clearFormData()
                    swal('Please go back to form to edit')
                  }
                  }>Edit</button></td>
                <td
                  style={{color: 'black'}}>
                  <button onClick={() => { this.confirmDeletion(this.deleteRecord, index) }
                  }>Delete</button>
                </td>
              </tr>
             )
            }
          </tbody>
        </table> : ''}
    </div>
  }
}

export default App

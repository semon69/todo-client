import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { json } from "react-router-dom";
import Swal from "sweetalert2";


function App() {

  const { data: todos = [], refetch } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await axios('https://todo-server-semon69.vercel.app/todos')
      return res.data
    }
  })
  console.log(todos);

  const handleAdd = event => {
    event.preventDefault()
    const form = event.target;
    const title = form.title.value;
    const description = form.description.value;
    const status = 'incomplete'
    const todo = { title, description, status }
    fetch('https://todo-server-semon69.vercel.app/todos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(todo)
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your app has been added',
          showConfirmButton: false,
          timer: 1500
        })
        refetch()
        form.reset()
      })
  }

  const handleUpdate = (id) => {
    fetch(`https://todo-server-semon69.vercel.app/todos/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your status has been updated',
          showConfirmButton: false,
          timer: 1500
        })
        refetch()
      })
  }

  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://todo-server-semon69.vercel.app/todos/${id}`,
          {
            method: 'DELETE'
          })
          .then(res => res.json())
          .then(data => {
            refetch()
            Swal.fire(
              'Deleted!',
              'Your app is deleted.',
              'success'
            )
          })
      }
    })
  }

  return (
    <>
      <div className="max-w-4xl mx-auto my-16">
        <h1 className="text-center text-5xl font-bold pb-10">ToDo App</h1>
        <div className="border p-5">
          <h3 className="text-center text-2xl font-semibold pb-5">Add ToDo</h3>
          <form onSubmit={handleAdd}>
            <input className="border mr-5 w-2/5 p-2" type="text" name="title" id="" placeholder="title" />
            <input className="border mr-5 w-2/5 p-2" type="text" name="description" id="" placeholder="description" />
            <input className="border bg-blue-600 text-xl font-semibold px-3 py-1 rounded text-white" type="submit" value="Add" />
          </form>
        </div>
        <h1 className="text-4xl font-bold text-center my-10">All ToDo's Here.....</h1>
        <div className="border p-5">
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="font-bold text-xl">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {
                  todos.map((todo, index) =>
                    <tr key={todo._id} className="bg-base-200 text-white">
                      <th>{index + 1}</th>
                      <td>{todo.title}</td>
                      <td> {todo.description} </td>
                      <td>{todo.status}</td>
                      <td><button onClick={() => handleUpdate(todo._id)} className="border px-3 bg-orange-500 rounded">Update</button></td>
                      <td><button onClick={() => handleDelete(todo._id)} className="border px-3 bg-red-500 rounded">Delete</button></td>
                    </tr>)
                }

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

import "./welcome-view.css"

export const WelcomeView = () => {
  return (
    <div class="form-group">
      <label for="exampleInputEmail1">Enter New Address</label>
      <input type="email" class="form-control" aria-describedby="emailHelp" placeholder="Ex. 1234 Cherrywood Ln"></input>
    </div>
  )
}
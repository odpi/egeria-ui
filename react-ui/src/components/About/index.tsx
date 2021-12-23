import React from "react";

interface Props {
}

interface State {
  data: {
    title: String,
    description: String
  }
}

class About extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: {
        title: '',
        description: ''
      }
    };
  }

  componentDidMount() {
    fetch(`/api/public/app/info`)
      .then(data => {
        return data.json()
      })
      .then(data => {
        this.setState({
          data: {
            ...data
          }
        });
      });
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <h1>About</h1>
        <h2>{ data.title.split("|") }</h2>
        <p>{ data.description.split("||") }</p>
      </div>
    );
  }
}

export default About;
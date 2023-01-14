
import "./Question.css";

export default function Question(props) {


  function renderOptions() {


    return props.allOptions.map((element, index) => {
      return (
        <div className="single_option_container">
          <input
            value={element}
            type="radio"
            id={props.id}
            name={`question ${props.name}`}
            className="click_options"
            onChange={(e) => props.handleOptions(props.id, element)}
          />
          <label htmlFor={element}>{element}</label>
        </div>
      );
    });
  }

  return (
    <div className="question_container">
      <h2 className="question_title">{props.question}</h2>
      <div className="options_container">{renderOptions()}</div>
    </div>
  );
}

import React, { createContext, useReducer } from 'react';

// Default context seed data
const defaultQuestionSets = [
  {
    "id": "generalInfo",
    "label": "General Info",
    "questions": [
      {
        "id": "name",
        "label": "What is your name?",
        "type": "text",
        "placeholder": "John Doe"
      }, {
        "id": "email",
        "label": "What is your email?",
        "type": "text",
        "placeholder": "hello@hackthenorth.com"
      }, {
        "id": "shirtSize",
        "label": "What is your shirt size?",
        "type": "select",
        "options": [
          {
            "label": "Small",
            "value": "small"
          }, {
            "label": "Medium",
            "value": "medium"
          }, {
            "label": "Large",
            "value": "large"
          }
        ]
      }, {
        "id": "travellingFrom",
        "label": "Where are you travelling from?",
        "type": "text",
        "placeholder": "Montreal, Quebec"
      }, {
        "id": "needsReimbursement",
        "label": "Will you need a travel reimbursement?",
        "type": "select",
        "options": [
          {
            "label": "Yes",
            "value": "y"
          }, {
            "label": "No",
            "value": "n"
          }
        ]
      }, {
        "id": "goal",
        "label": "What is your goal to accomplish Hack the North?",
        "type": "longText",
        "placeholder": "Build something cool!"
      }
    ]
  }, {
    "id": "technicalSkills",
    "label": "Technical Skills",
    "questions": [
      {
        "id": "github",
        "label": "What is your github profile?",
        "type": "text",
        "placeholder": "https://github.com/"
      }, {
        "id": "interest",
        "label": "What is your main interest?",
        "type": "select",
        "options": [
          {
            "label": "Frontend",
            "value": "fe"
          }, {
            "label": "Backend",
            "value": "be"
          }, {
            "label": "Machine Learning",
            "value": "ml"
          }, {
            "label": "Product Design",
            "value": "pd"
          }
        ]
      }, {
        "id": "project",
        "label": "What is a cool project that you built? How did you build it? Why did you build it?",
        "type": "longText",
        "placeholder": "Uber for dogs"
      }
    ]
  }
];

const addStateToQuestions = questions => {
  const newQuestions = questions.map(q => ({
    ...q,
    curValue: ''
  }));

  return newQuestions;
};


const addStateToQuestionSets = questionSets => {
  const newQS = questionSets.map(qs => ({
    ...qs,
    completed: false,
    questions: addStateToQuestions(qs.questions)
  }));

  return newQS;
};



const updateQuestions = (questions, questionId, questionResponse) => {

  const newQuestions = questions.map(q => ({
    ...q,
    curValue: (q.id === questionId ? questionResponse : q.curValue)
  }))


  return newQuestions;
}

const updateQuestionSets = (questionSets, qsId, questionId, questionResponse) => {
  let newQS = questionSets.map(qs => ({
    ...qs,
    questions: (qs.id === qsId) ? updateQuestions(qs.questions, questionId, questionResponse) : qs.questions,
  }));

  newQS = newQS.map(qs => ({
    ...qs,
    completed: qs.questions.every(question => question.curValue !== ''),
  }));

  return newQS;
}


const DASHBOARD_PAGE = 'dashboard';
const defaultLocation = DASHBOARD_PAGE;


const initialState = {
  questionSets: addStateToQuestionSets(defaultQuestionSets),
  applicationCompleted: false,
  applicationSubmitted: false,
  curLocation: defaultLocation
};

const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;

    case "goHome":
      return { ...state, curLocation: DASHBOARD_PAGE };

    case "goToQuestionSet":
      return { ...state, curLocation: action.newLoc };

    case "updateApplication": {
      let newState = {
        ...state,
        questionSets: updateQuestionSets(state.questionSets, action.data.setId, action.data.questionId, action.data.questionResponse),
      };
      newState = {
        ...newState,
        applicationCompleted: newState.questionSets.every(qs => qs.completed)
      };
      return newState;
    }

    case "submitApp":
      return { ...state, applicationSubmitted: true };

    default:
      return state;
  }
};

export const SiteContext = createContext();

export const SiteContextConsumer = SiteContext.Consumer;

const SiteContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
  );
}

export default SiteContextProvider;

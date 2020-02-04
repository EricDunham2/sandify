import { Vertex } from '../Geometry';

export const setShapeStarPoints = ( sides ) => {
  return {
    type: 'SET_SHAPE_STAR_POINTS',
    value: sides,
  };
}

export const setShapeStarRatio = ( value ) => {
  return {
    type: 'SET_SHAPE_STAR_RATIO',
    value: Math.min(Math.max(value, 0.0), 1.0),
  };
}


export class Star {
  static mapStateToProps(state, ownProps) {
    return {
      starPoints:   state.shapes.starPoints,
      starRatio:    state.shapes.starRatio,
    }
  }

  static mapDispatchToProps(dispatch, ownProps) {
    return {
      onStarPointsChange: (event) => {
        dispatch(setShapeStarPoints(event.target.value));
      },
      onStarRatioChange: (event) => {
        dispatch(setShapeStarRatio(event.target.value));
      },
    }
  }

  static getParams(parent) {
    return {
      name: "Star",
      vertices: (state) => {
        let star_points = [];
        for (let i=0; i<state.shapes.starPoints * 2; i++) {
          let angle = Math.PI * 2.0 / (2.0 * state.shapes.starPoints) * i;
          let star_scale = 1.0;
          if (i % 2 === 0) {
            star_scale *= state.shapes.starRatio;
          }
          star_points.push(Vertex(star_scale * Math.cos(angle), star_scale * Math.sin(angle)))
        }
        return star_points
      },
      options: [
        {
          title: "Number of Points",
          key: "starPoints",
          value: () => { return parent.props.starPoints },
          onChange: parent.props.onStarPointsChange,
        },
        {
          title: "Size of Points",
          key: "starRatio",          
          value: () => { return parent.props.starRatio },
          onChange: parent.props.onStarRatioChange,
          step: 0.05,
        },
      ],
    };
  }

  static getReducer(state, action) {
    switch(action.type) {
      case 'SET_SHAPE_STAR_POINTS':
        return {...state,
          starPoints: action.value,
        };

      case 'SET_SHAPE_STAR_RATIO':
        return {...state,
          starRatio: action.value,
        };

      default:
        return state;
    }
  }
}

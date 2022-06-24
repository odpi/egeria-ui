// import React from 'react';
// import { createStyles, Text } from '@mantine/core';
// import { useListState } from '@mantine/hooks';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const useStyles = createStyles((theme) => ({
//   item: {
//     ...theme.fn.focusStyles(),
//     display: 'flex',
//     alignItems: 'center',
//     borderRadius: theme.radius.md,
//     border: `1px solid ${
//       theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
//     }`,
//     padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
//     backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
//     marginBottom: theme.spacing.sm,
//   },

//   itemDragging: {
//     boxShadow: theme.shadows.sm,
//   },

//   symbol: {
//     fontSize: 30,
//     fontWeight: 700,
//     width: 60,
//   },
// }));

// interface DndListProps {
//   data: {
//     position: number;
//     mass: number;
//     symbol: string;
//     name: string;
//   }[];
// }

// export function DndList({ data }: DndListProps) {
//   const { classes, cx } = useStyles();
//   const [state, handlers] = useListState(data);

//   const items = state.map((item, index) => (
//     <Draggable key={item.symbol} index={index} draggableId={item.symbol}>
//       {(provided: any, snapshot: any) => (
//         <div
//           className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           ref={provided.innerRef}
//         >
//           <Text className={classes.symbol}>{item.symbol}</Text>
//           <div>
//             <Text>{item.name}</Text>
//             <Text color="dimmed" size="sm">
//               Position: {item.position} • Mass: {item.mass}
//             </Text>
//           </div>
//         </div>
//       )}
//     </Draggable>
//   ));

//   return (
//     <DragDropContext
//       onDragEnd={(data: any) => {
//           const { destination, source } = data;
//           return handlers.reorder({ from: source.index, to: destination.index })
//         }
//       }
//     >
//       <Droppable droppableId="dnd-list" direction="vertical">
//         {(provided: any) => (
//           <div {...provided.droppableProps} ref={provided.innerRef}>
//             {items}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// }



import React from "react";
import { Accordion, LoadingOverlay, Paper, Text } from '@mantine/core';
import { capitalize } from "../../helpers/commons";

interface Props {
}

interface State {
  data: {
    loaded: boolean,
    name: String,
    version: String,
    commitId: String,
    buildTime: String
  }
}

/**
 *
 * React component used for displaying details about the application instance.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class About extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: {
        loaded: false,
        name: '',
        version: '',
        commitId: '',
        buildTime: ''
      }
    };
  }

  componentDidMount() {
    fetch(`/about.json`)
      .then(data => {
        return data.json()
      })
      .then(data => {
        this.setState({
          data: {
            ...data,
            loaded: true
          }
        });
      });
  }

  render() {
    const { data } = this.state;

    return (<>
      <div style={{ height:'100%', position: 'relative' }}>
        <LoadingOverlay visible={!data.loaded} />

        <Paper shadow="xs" p="md" style={{height: '100%'}}>
          <Text size="xl">About</Text>
          <Accordion>
            { Object.keys(data).filter(k => k !== 'loaded').map((k, index) => {
              return (
                <Accordion.Item label={capitalize(k)} key={index}>
                  {/* @ts-ignore */}
                  { capitalize(data[k]) }
                </Accordion.Item>
              );
            }) }
          </Accordion>
        </Paper>
      </div>
    </>);
  }
}

export default About;
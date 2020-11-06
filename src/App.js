import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import './App.css';

const itemsFromBackend = [
	{
		id: uuid(),
		content: 'First task',
	},
	{
		id: uuid(),
		content: 'Second task',
	},
	{
		id: uuid(),
		content: 'Third task',
	},
	{
		id: uuid(),
		content: 'Fourth task',
	},
];
const columnsFromBackend = {
	[uuid()]: {
		name: 'Requested',
		items: itemsFromBackend,
	},
	[uuid()]: {
		name: 'Todo',
		items: [],
	},
	[uuid()]: {
		name: 'In Progress',
		items: [],
	},
	[uuid()]: {
		name: 'Done',
		items: [],
	},
};

const onDragEnd = (result, columns, setColumns) => {
	if (!result.destination) return;
	const { source, destination } = result;
	if (source.droppableId !== destination.droppableId) {
		const sourceColumn = columns[source.droppableId];
		const destColumn = columns[destination.droppableId];
		const sourceItems = [...sourceColumn.items];
		const destItems = [...destColumn.items];
		const [removed] = sourceItems.splice(source.index, 1);
		destItems.splice(destination.index, 0, removed);
		setColumns({
			...columns,
			[source.droppableId]: {
				...sourceColumn,
				items: sourceItems,
			},
			[destination.droppableId]: {
				...destColumn,
				items: destItems,
			},
		});
	} else {
		const column = columns[source.droppableId];
		const copiedItems = [...column.items];
		const [removed] = copiedItems.splice(source.index, 1);
		copiedItems.splice(destination.index, 0, removed);
		setColumns({
			...columns,
			[source.droppableId]: {
				...column,
				items: copiedItems,
			},
		});
	}
};

function App() {
	const [columns, setColumns] = useState(columnsFromBackend);

	return (
		<div className='main'>
			<DragDropContext
				onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
				{Object.entries(columns).map(([columnId, column], index) => {
					return (
						<div className='body1' key={columnId}>
							<h2>{column.name}</h2>
							<div className='vertical'>
								<Droppable droppableId={columnId} key={columnId}>
									{(provided, snapshot) => {
										return (
											<div
												{...provided.droppableProps}
												ref={provided.innerRef}
												className={`box ${column.items.length && 'bg-color'}`}>
												{column.items.map((item, index) => {
													return (
														<Draggable
															key={item.id}
															draggableId={item.id}
															index={index}>
															{(provided, snapshot) => {
																return (
																	<div
																		//className='box1'
																		className='boxes'
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																		//className='box2'
																		style={{
																			...provided.draggableProps.style,
																		}}>
																		{item.content}
																	</div>
																);
															}}
														</Draggable>
													);
												})}
												{provided.placeholder}
											</div>
										);
									}}
								</Droppable>
							</div>
						</div>
					);
				})}
			</DragDropContext>
		</div>
	);
}

export default App;

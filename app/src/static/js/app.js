function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);
    if (items != null) {
        for (let index = 0; index < items.length; index++) {
            let date = new Date(items[index].date);
            items[index].date = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
        }
    }
    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            {items.length === 0 && (
                <p className="text-center">You have no todo items yet! Add one above!</p>
            )}
            {items.map(item => (
                <ItemDisplay
                    item={item}
                    key={item.id}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function AddItemForm({ onNewItem }) {
    const { Form, InputGroup, Button, Row, Col } = ReactBootstrap;

    const [newTitle, setNewTitle] = React.useState('');
    const [newCategory, setNewCategory] = React.useState('');
    const [newDate, setNewDate] = React.useState('');
    const [newDetail, setNewDetail] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = e => {
        // console.log(newTitle);
        // console.log(newCategory);
        // console.log(newDate);
        // console.log(newDetail);
        let newItem={title:newTitle,category:newCategory,detail:newDetail,date:newDate};
        console.log(JSON.stringify(newItem));
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewTitle('');
                setNewCategory('');
                setNewDate('dd/mm/yyyy');
                setNewDetail('');
            });
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup >
                <Form.Group as={Row} className="mb-3">
                    <Form.Control column
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        type="text"
                        placeholder="Event's category"
                        aria-describedby="basic-addon1"
                    />
                    <Form.Control column
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        type="text"
                        placeholder="Event's title"
                        aria-describedby="basic-addon1"
                    />
                    <Form.Control column
                        value={newDate}
                        onChange={e => setNewDate(e.target.value)}
                        type="date"
                        aria-describedby="basic-addon1"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Control
                        value={newDetail}
                        onChange={e => setNewDetail(e.target.value)}
                        as="textarea"
                        placeholder="Event's description"
                        rows={3} cols="50"
                        aria-describedby="basic-addon1"
                    />
                </Form.Group>
                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        className={submitting ? 'disabled' : ''}
                    >
                        {submitting ? 'Adding...' : 'Add'}
                    </Button>
                </InputGroup.Append>

            </InputGroup>
        </Form>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const { Container, Row, Col, Button } = ReactBootstrap;

    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    return (
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>

                <Col xs={10} className="date">
                    {item.date}
                </Col>
                <Col xs={10} className="name">
                    {item.title + ' (' + item.category + ')'}
                </Col>
                <Col xs={1} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
                <Col xs={10} className="detail">
                    {item.detail}
                </Col>

            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

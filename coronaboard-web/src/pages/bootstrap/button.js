import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, ButtonGroup } from 'react-bootstrap';

export default function ButtonPage() {
    return (
        <Container>
            <div>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="info">Info</Button>
                <Button variant="light">Light</Button>
                <Button variant="dark">Dark</Button>
            </div>
            <hr />
            <ButtonGroup size="md">
                <Button variant="primary">오늘</Button>
                <Button variant="outline-primary">어제</Button>
            </ButtonGroup>
        </Container>
    )
}
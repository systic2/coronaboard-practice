import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Accordion, Button } from 'react-bootstrap';

export default function CardAccordionPage() {
    return (
        <Container className="pt-3">
            <Accordion defaultActiveKey="0">
                
                <Accordion.Item eventKey="0">
                    <Accordion.Header>아코디언 헤더</Accordion.Header>
                    <Accordion.Body>아코디언 컨텐츠</Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    )
}
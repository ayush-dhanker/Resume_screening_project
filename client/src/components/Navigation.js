import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import "./Navigation.css"
import BubbleText from './BubbleText';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
} from 'reactstrap';

function Navigation(args) {

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div style={{ marginBottom: '2rem' }}>
            <Navbar className='.col-6'
                color='dark'
                dark
                full="true"
                container="fluid"
                expand="md"
                // fixed='top'
                {...args}>
                <NavbarBrand href="/">
                    <BubbleText text='Home' />
                </NavbarBrand>
                <NavbarBrand href="/jobs">
                    <BubbleText text='Jobs' />
                </NavbarBrand>
                <NavbarBrand href="/about">
                    <BubbleText text='About' />
                </NavbarBrand>
            </Navbar>
        </div>
    );
}

export default Navigation;

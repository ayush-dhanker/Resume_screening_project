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
                {/* <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        <NavItem>
                            <NavLink href="/components/">Components</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="https://github.com/reactstrap/reactstrap">
                                GitHub
                            </NavLink>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Options
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>Option 1</DropdownItem>
                                <DropdownItem>Option 2</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>Reset</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                    <NavbarText>Simple Text</NavbarText>
                </Collapse> */}
            </Navbar>
        </div>
        // <nav className="navbar">
        //     <Link to="/" className="nav-link">Home</Link>
        //     <Link to="/about" className="nav-link">About</Link>
        //     <Link to="/jobs" className="nav-link">Apply Jobs</Link>
        // </nav>
    );
}

export default Navigation;

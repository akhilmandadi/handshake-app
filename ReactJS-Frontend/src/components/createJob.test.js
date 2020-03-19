import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CreateJob from './createJob';
configure({ adapter: new Adapter() });

describe('Create Job Page Component', () => {
    let component;
    const props = {
        student: {
        }
    }
    beforeEach(() => {

    })
    it('Should Render Correctly', () => {

        component = renderer.create(
            <CreateJob />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Enable the Profile Edit option on clicking the edit Icon', () => {

        component = renderer.create(
            <CreateJob  {...props} />
        );
        let job = component.getInstance();
        expect(job.state.description).toBe("");
        job.descriptionChangeHandler({ "target": { "value": "SDE" } });
        expect(job.state.description).toBe("SDE");
    });

})
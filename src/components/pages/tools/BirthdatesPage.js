import React from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    ButtonGroup,
    Button
} from '@material-ui/core';
import { Calendar, globalizeLocalizer } from 'react-big-calendar'
import globalize from 'globalize';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import ContainerComponent from "../../base/ContainerComponent";
import LoadingMaskComponent from "../../base/LoadingMaskComponent";
import happyBirthday from '../../../resources/images/happy_birthday.png';
import Utils from '../../../utils/Utils';

require('globalize/lib/cultures/globalize.culture.es')

const globalLocalizer = globalizeLocalizer(globalize);

function CustomToolbar(props) {
    const disabledPrev = props.date.getMonth() === 0;
    const disabledNext = props.date.getMonth() === 11;
    return (
        <div className="rbc-toolbar">
            <ButtonGroup color="primary" size="small" aria-label="small outlined primary button group">
                <Button onClick={() => props.onNavigate("TODAY")}>Hoy</Button>
                <Button disabled={disabledPrev} onClick={() => props.onNavigate("PREV")}>{"<"}</Button>
                <Button disabled={disabledNext} onClick={() => props.onNavigate("NEXT")}>{">"}</Button>
            </ButtonGroup>
            <span className="rbc-toolbar-label">Cumpleaños {props.label}</span>
        </div>
      )
}

export default class BirthdatesPage extends ContainerComponent {

    constructor() {
        super();
        this.state = {
            events: [],
            event: {},
            dialogOpen: false,
            loading: false,
            year: new Date().getFullYear()
        }
    }

    async componentDidMount() {
        this.setState({ loading: true });
        const birthdates = (await Utils.userApps("birthdates")).data;
        this.setState({ loading: false });
        if (birthdates) {
            const events = [];
            birthdates.forEach(evt => {
                if (!evt.birthdate) return;

                const evtDate = new Date(`${evt.birthdate}T00:00:00`);
                evtDate.setFullYear(new Date().getFullYear());
                events.push({
                    start: evtDate,
                    end: evtDate,
                    title: evt.full_name
                })
            });
            this.setState({ events });
        }
    }

    onSelectEvent(event) {
        this.setState({
            dialogOpen: true,
            event
        })
    }

    render() {
        return (
            <>
                <LoadingMaskComponent active={this.state.loading} />
                <ContainerComponent showHeader={true}
                    renderOneFullColGrid={true}
                    middle={
                        <Calendar culture="es"
                            localizer={globalLocalizer}
                            events={this.state.events}
                            views={["month"]}
                            style={{ 
                                height: 800,
                                marginTop: 30
                            }}
                            onSelectEvent={(evt) => this.onSelectEvent(evt)}
                            components={{
                                toolbar: CustomToolbar
                            }}
                        />
                    }
                />
                <Dialog aria-labelledby="dialog-img-info"
                    onClose={() => this.setState({ dialogOpen: false })}
                    open={this.state.dialogOpen}
                >
                    <DialogTitle id="dialog-img-info">{this.state.event.title}</DialogTitle>
                    <DialogContent>
                        <center><img style={{width:'100%'}} src={happyBirthday} alt="" /></center>
                    </DialogContent>
                </Dialog>
            </>
        )
    }
}
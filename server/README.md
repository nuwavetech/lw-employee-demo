Employee Server
---------------

The Employee Server is a standard Pathway server written in 'C'. This project contains the server source code, test data to initialize the Enscribe employee database, and a TACL macro to start the Pathway configuration for the server.

The [emppak.bin](./emppak.bin) file is a NonStop PAK file that contains the Employee Server files listed in this folder. This provides a convenient method for transferring all of the files at once to the NonStop. Transfer the [emppak.bin](./emppak.bin) file to a subvolume on your NonStop system using "binary" transfer mode.

If you choose to transfer the files individually, use "ascii" transfer mode for all files except those with the ".bin" extension, which should be transferred in "binary" mode.

The remainder of the steps should be performed from TACL in the same subvolume.

1. UNPAK EMPPAK ($\*.\*.\*), MYID, VOL *$vol.subvol*, LISTALL
   * This UNPAKs the project files into the current subvolume.

2. RUN MAKEDB
   * This creates a DDL dictionary in the current subvolume, loads EMPDDL, and generates EMPH ('C' include file) and EMPFUP (FUP commands). It then creates the Enscribe data file, EMPDATA.

3. RUN MAKESVR
   * This compiles the server from the supplied EMPSVRC and EMPH generated above.

4. RUN STARTUP
   * This starts a Pathmon, $NWEMP, and configures the EMPSVR program as serverclass EMPLOYEE-SERVER.

5. Add the following DEFINE to your LightWave Server startup and restart LightWave:

    ADD DEFINE =EMPLOYEE-PATHMON, CLASS MAP, FILE $NWEMP


